
from flask import Blueprint, request, redirect
from utils import token_required_dec
import requests
import os

from dotenv import load_dotenv
load_dotenv()


ocr_bp = Blueprint("ocr", __name__) 


OCR_BASE = os.environ.get("OCR_BASE")


@ocr_bp.post("/process")
@token_required_dec
def process_img():
    ocr_service_url = f"{OCR_BASE}/ocr/process"
    response = requests.post(ocr_service_url, data=request.data,headers=request.headers)
    return response.json(), response.status_code
    

    
    


