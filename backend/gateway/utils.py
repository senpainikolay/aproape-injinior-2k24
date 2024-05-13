import requests
from functools import wraps
import os 
from flask import jsonify, request

from dotenv import load_dotenv
load_dotenv()

AUTH_BASE = os.environ.get("AUTH_BASE")


def verify_token(token):
    auth_service_url = f"{AUTH_BASE}/auth/me"
    headers = {'Authorization': token}
    response = requests.get(auth_service_url, headers=headers)
    if response.status_code == 200:
        return True
    else:
        return False

def token_required_dec(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Authorization token is missing'}), 401
        
        if verify_token(token):
            return f(*args, **kwargs)
        else:
            return jsonify({'message': 'Unauthorized from gateway'}), 401
    return decorated_function
