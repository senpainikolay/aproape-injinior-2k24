from flask import Blueprint, request, redirect
import requests
import os


from dotenv import load_dotenv
load_dotenv()


tg_bp = Blueprint("telegram", __name__) 


TG_BASE = os.environ.get("TG_BASE")


@tg_bp.post("/catch")
def catchevent():
    data = request.get_data()
    
    tg_service_url = f"{TG_BASE}/webhook"
    response = requests.post(tg_service_url, data=data)
    
    return redirect(response.url, code=response.status_code)
    
