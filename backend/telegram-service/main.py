from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import requests
import uvicorn
import utils


import os
import json

from informative_exception import InformativeException
from models import ImageExtractedDataStateManager

from redis.cluster import RedisCluster
import redis


from dotenv import load_dotenv
load_dotenv()

TG_KEY = os.getenv("TG_BOT_KEY")


OCR_API = "http://" + os.getenv("OCR_HOST") +  ":" + os.getenv("OCR_PORT")  + "/ocr/process"

AUTH_API = os.getenv("AUTH_API") 
TR_API = os.getenv("TR_API") 






Redis_Client = RedisCluster(os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT")) 
#Redis_Client =  redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT")) 


app = FastAPI()



MSG_OPTIONS = 'Please choose what you want to modify or confirm your transaction:'
OPTIONS = [['Entity', 'Total', 'Payment Method'], ['Date', 'Address'], ['Confirm','Cancel']]




class TelegramMessage(BaseModel):
    update_id: int
    message: dict 

@app.post("/webhook")
async def telegram_webhook(request: Request, message: TelegramMessage):

    try:
        message_data = message.message
        # Check if telegram username is public
        check_username_public(message_data)
        usr = message_data["from"]["username"]
        # Check if authenticated ( recieved the OTP)
        usr_exists = Redis_Client.exists(usr)
        if  usr_exists:
            
            chat_id = message_data["chat"]["id"]
            user_img_info = Redis_Client.get(usr)
            # If the user has cached some OCR processed data
            if user_img_info:
                json_unmarshelled = json.loads(user_img_info)
                img_data =  ImageExtractedDataStateManager.from_redis_dict(json_unmarshelled)
                # if the user is using the dialog options
                if 'text' in message_data:
                    txt = message_data['text']
                    if img_data.check_input_and_change_state(txt):
                        json_data = json.dumps(img_data.to_dict())
                        Redis_Client.set(usr,json_data)
                        raise InformativeException(f"Write the data for the {img_data.modify_state}:")
                    elif txt == "Confirm":
                        Redis_Client.set(usr,"")
                        acc_id = proccess_account_options(usr)
                        if add_transaction_succesful(img_data.to_transaction_entity(),acc_id,chat_id):
                            raise InformativeException(f"Transaction saved.")
                        
                        raise InformativeException(f"Something Wrong with processing the transaction")
                    

                    elif txt == "Cancel":
                        Redis_Client.set(usr,"")
                        raise InformativeException(f"Cancelled! Send us a check again :)")
                    else:
                        if img_data.check_and_modify_data_on_state(txt):
                            img_data.reset_state()
                            print(img_data.to_dict())
                            json_data = json.dumps(img_data.to_dict())
                            Redis_Client.set(usr,json_data)
                            send_message(chat_id,"Modified!")
                            send_message(chat_id,img_data.to_user_ui())
                            send_options(chat_id, MSG_OPTIONS, OPTIONS)
                            return {"status": "ok"}
                        else:
                            send_message(chat_id,img_data.to_user_ui())
                            send_options(chat_id,"No options selected! Please click on buttons below:", OPTIONS)
                            return {"status": "ok"}


                else:
                    send_message(chat_id,img_data.to_user_ui())
                    send_options(chat_id, MSG_OPTIONS, OPTIONS)
                    return {"status": "ok"} 
            # Proceeding to check if image exists and apply OCR
            else:
                image_data = process_tg_image(message_data)
                if image_data is None:
                   raise InformativeException("Send us a check to process!")
                else:
                    img_data_entity = ImageExtractedDataStateManager.from_api_dict(image_data)
                    json_data = json.dumps(img_data_entity.to_dict())
                    Redis_Client.set(usr,json_data)
                    send_message(chat_id,"Check processed!")
                    send_message(chat_id,img_data_entity.to_user_ui())
                    send_options(chat_id, MSG_OPTIONS, OPTIONS)
                    return {"status": "ok"} 

        # always checking the code in authentication service
        else:
            check_user_registration(message_data,usr)

        return {"status": "ok"}
    except InformativeException as e:
        message_data = message.message
        chat_id = message_data["chat"]["id"]
        send_message(chat_id, str(e.message))
        return {"status": "ok", "message" : e.message } 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    




def check_user_registration(tg_msg,usr):
    if 'text' in tg_msg:
        num = tg_msg['text']
        if check_code_req(num,usr):
            raise InformativeException(message="Registered succesfully")
        else:
            raise InformativeException(message="Something wrong with the code. Could be invalid or expired. Provide one from the main app.")
    raise InformativeException(message="Seems like you are not registered. Take the code from the app and send it here. It will be processed automatically.")
    



def check_code_req(code,usr): 
    data = { "otp": code, "tg_usrname": usr}

    response = requests.post(AUTH_API + "/auth/validate_otp", json=data)

    if response.status_code == 200:
       Redis_Client.set(usr, "")
       return True
    else:
        return False
    


def add_transaction_succesful(transaction,acc_id,chat_id): 
    tr_service_url =  TR_API + f"/accounts/{acc_id}/transactions"
    res = requests.post(tr_service_url, json=transaction)
    if res.status_code != 200:
        send_message(chat_id, "debugging for tg add transaction")
        send_message(chat_id,res.status_code)
        return False
    return True




def proccess_account_options(usr):
    data = {  "tg_usrname": usr}
    response = requests.post(AUTH_API + "/auth/getbytg", json=data)

    if response.status_code == 200:
        acc_id = response.json().get('acc_id')
        return acc_id
    else:
        raise InformativeException(message="Something wrong with auth service :( ")

    


    

def check_username_public(tg_msg):
    try:
        usr = tg_msg["from"]["username"]
    except Exception:
        raise InformativeException(message="We can not read your username. Make it public.")



def send_message(chat_id, text):
    url = f"https://api.telegram.org/bot{TG_KEY}/sendMessage"
    data = {
        "chat_id": chat_id,
        "text": str(text)
    }
    response = requests.post(url, json=data)
    if response.status_code != 200:
        print(f"Failed to send message: {response.text}")

def process_tg_image(message):
    if "photo" in message:
        photo_array = message["photo"]
        photo = photo_array[-1]
        file_id = photo["file_id"]
        req_path = f"https://api.telegram.org/bot{TG_KEY}/getFile?file_id={file_id}"
        response = requests.get(req_path)
        if response.status_code == 200:
            parsed_res = json.loads(response.content)
            try:
                file_path = parsed_res["result"]["file_path"]
                response = requests.get(f"https://api.telegram.org/file/bot{TG_KEY}/{file_path}")
                if response.status_code == 200:

                    encrypted_image = utils.encrypt_image(response.content)


                    image_hmac = utils.generate_hmac(encrypted_image)

                    form_data = {
                        'enimg': encrypted_image, 
                        'hmac': image_hmac
                    }

                    ocr_api_res = requests.post(OCR_API, data=form_data)


                    if ocr_api_res.status_code == 200:
                        res_ocr = json.loads(ocr_api_res.content)
                        return res_ocr
            except:
                return None
    return None



def send_options(chat_id, text, options):
    BASE_URL = f'https://api.telegram.org/bot{TG_KEY}/'

    reply_markup = {
        'keyboard': options,
        'one_time_keyboard': True,
        'resize_keyboard': True
    }
    reply_markup_json = json.dumps(reply_markup)

    data = {
        'chat_id': chat_id,
        'text': text,
        'reply_markup': reply_markup_json
    }

    response = requests.post(BASE_URL + 'sendMessage', data=data)
    if response.status_code != 200:
        print(f"Failed to send message: {response.text}")



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=os.getenv("PORT")) 