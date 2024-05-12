from cryptography.fernet import Fernet
import hmac
import hashlib
import os

from dotenv import load_dotenv
load_dotenv()




def encrypt_image(image_bytes):
    f = Fernet(os.getenv("F_SECRET").encode())
    encrypted_data = f.encrypt(image_bytes)
    return encrypted_data

def generate_hmac(data):
    h = hmac.new(os.getenv("H_SECRET").encode(), data, hashlib.sha256)
    return h.hexdigest()
