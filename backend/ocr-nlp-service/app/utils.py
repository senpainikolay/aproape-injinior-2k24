import hmac
import hashlib
from cryptography.fernet import Fernet
import os

from dotenv import load_dotenv
load_dotenv()



SECRET_KEY =  os.environ.get("H_SECRET").encode()
F_SECRET_KEY =  os.environ.get("F_SECRET").encode()

def verify_hmac(data, received_hmac):
    expected_hmac = hmac.new(SECRET_KEY, data, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_hmac, received_hmac)

def decrypt_data(data):
    cipher_suite = Fernet(F_SECRET_KEY)
    return cipher_suite.decrypt(data.encode())