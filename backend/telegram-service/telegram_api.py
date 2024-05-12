
import os 
import requests
import json

from dotenv import load_dotenv
load_dotenv()

class TelegramAPI:
    BASE_URL = f'https://api.telegram.org/bot{ os.getenv("TG_BOT_KEY") }/'

    @staticmethod
    def send_message(chat_id, text):
        data = {
            "chat_id": chat_id,
            "text": str(text)
        }
        response = requests.post(TelegramAPI.BASE_URL + 'sendMessage', json=data)
        if response.status_code != 200:
            print(f"Failed to send message: {response.text}")

    @staticmethod
    def send_options(chat_id, text, options):
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

        response = requests.post(TelegramAPI.BASE_URL + 'sendMessage', json=data)
        if response.status_code != 200:
            print(f"Failed to send message: {response.text}")