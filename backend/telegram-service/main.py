from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import requests
import uvicorn
import utils


import os
import json

from informative_exception import InformativeException
from models import ImageInformationEntity

from redis.cluster import RedisCluster
import redis


from dotenv import load_dotenv
load_dotenv()

TG_KEY = os.getenv("TG_BOT_KEY")


OCR_API = "http://" + os.getenv("OCR_HOST") +  ":" + os.getenv("OCR_PORT")  + "/ocr/process"




Redis_Client = RedisCluster(os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT")) 
#Redis_Client =  redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT")) 


app = FastAPI()





class TelegramMessage(BaseModel):
    update_id: int
    message: dict 

@app.post("/webhook")
async def telegram_webhook(request: Request, message: TelegramMessage):

    try:
        message_data = message.message
        check_username_public(message_data)
        usr = message_data["from"]["username"]
        usr_exists = Redis_Client.exists(usr)
        if  usr_exists:
            
            chat_id = message_data["chat"]["id"]
            user_img_info = Redis_Client.get(usr)

            text = 'Please choose what you want to modify or confirm your transaction:'
            options = [['Entity', 'Total', 'Payment Method'], ['Date', 'Address'], ['Confirm','Cancel']]
            
            if user_img_info:
                json_unmarshelled = json.loads(user_img_info)
                img_data =  ImageInformationEntity.from_redis_dict(json_unmarshelled)
                if 'text' in message_data:
                    txt = message_data['text']
                    if img_data.check_input_and_change_state(txt):
                        json_data = json.dumps(img_data.to_dict())
                        Redis_Client.set(usr,json_data)
                        raise InformativeException(f"Write the data for the {img_data.modify_state}:")
                    elif txt == "Confirm":
                        Redis_Client.set(usr,"")

                        # DE COMPLETAT 



                        raise InformativeException(f"Sent to Marius")
                    

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
                            send_options(chat_id, text, options)
                            return {"status": "ok"}
                        else:
                            send_message(chat_id,img_data.to_user_ui())
                            send_options(chat_id,"No options selected! Please click on buttons below:", options)
                            return {"status": "ok"}


                else:
                    send_message(chat_id,img_data.to_user_ui())
                    send_options(chat_id, text, options)
                    return {"status": "ok"} 
            else:
                image_data = process_tg_image(message_data)
                if image_data is None:
                   raise InformativeException("Send us a check to process!")
                else:
                    img_data_entity = ImageInformationEntity.from_api_dict(image_data)
                    json_data = json.dumps(img_data_entity.to_dict())
                    Redis_Client.set(usr,json_data)
                    send_message(chat_id,"Check processed!")
                    send_message(chat_id,img_data_entity.to_user_ui())
                    send_options(chat_id, text, options)
                    return {"status": "ok"} 


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
        try:
            num = int(tg_msg['text'])
        except Exception:
            raise InformativeException(message="Seems like you are not registered. Take the code from the app and send it here. It will be processed automatically. Send the plain number only!")
        
        num = int(tg_msg['text'])
        if check_code_req(num,usr):
            raise InformativeException(message="Registered succesfully")
        else:
            raise InformativeException(message="The code is wrong or there is something wrong with the authentication server!")
    raise InformativeException(message="Seems like you are not registered. Take the code from the app and send it here. It will be processed automatically.")
    



def check_code_req(code,usr):
    if code == 19:
        Redis_Client.set(usr, "")
        return True
    else:
        return False

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

                    other_api_response = requests.post(OCR_API, data=form_data)


                    if other_api_response.status_code == 200:
                        res_ocr = json.loads(other_api_response.content)
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