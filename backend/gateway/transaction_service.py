
from flask import Blueprint, request
from utils import token_required_dec
import requests
import os

from utils import get_usr_info

from dotenv import load_dotenv
load_dotenv()


t_bp = Blueprint("user", __name__) 


T_BASE = os.environ.get("T_BASE")



@t_bp.post("/accounts")
@token_required_dec
def post_accoounts():
    a = request.headers.get('Authorization')

    usr_json = get_usr_info(a)
    usr_id = usr_json.get('id')

    tr_service_url = f"{T_BASE}/users/{usr_id}/accounts/"
    response = requests.post(tr_service_url, data=request.data,headers=request.headers)
    return response.json(), response.status_code

@t_bp.get("/accounts/currencies")
@token_required_dec
def get_currencies():
    tr_service_url = f"{T_BASE}/currencies/"
    response = requests.get(tr_service_url, headers=request.headers)
    return response.json(), response.status_code


@t_bp.get("/accounts")
@token_required_dec
def get_accounts():
    a = request.headers.get('Authorization')

    usr_json = get_usr_info(a)
    usr_id = usr_json.get('id')

    tr_service_url = f"{T_BASE}/users/{usr_id}/accounts/"
    response = requests.get(tr_service_url, headers=request.headers)
    return response.json(), response.status_code


@t_bp.get("/account/<account_id>")
@token_required_dec
def get_account_by_id(account_id):
    a = request.headers.get('Authorization')
    usr_json = get_usr_info(a)
    usr_id = usr_json.get('id')

    tr_service_url = f"{T_BASE}/users/{usr_id}/accounts/{account_id}"
    response = requests.get(tr_service_url, headers=request.headers)
    return response.json(), response.status_code


@t_bp.get("/accounts/<account_id>/transactions")
@token_required_dec
def get_transactions_by_acc_id(account_id):

    tr_service_url = f"{T_BASE}/accounts/{account_id}/transactions"
    response = requests.get(tr_service_url, headers=request.headers)
    return response.json(), response.status_code




@t_bp.post("/accounts/<account_id>/transactions")
@token_required_dec
def post_transactions_by_acc_id(account_id):

    tr_service_url =  f"{T_BASE}/accounts/{account_id}/transactions"
    response = requests.post(tr_service_url, data=request.data,headers=request.headers)
    return response.json(), response.status_code



@t_bp.get("/accounts/<account_id>/balance/timeseries")
@token_required_dec
def get_balance_timeseries_by_acc_id(account_id):

    tr_service_url = f"{T_BASE}/accounts/{account_id}/balance/timeseries"
    response = requests.get(tr_service_url, headers=request.headers)
    return response.json(), response.status_code


@t_bp.get("/accounts/<account_id>/balance")
@token_required_dec
def get_balance_by_acc_id(account_id):

    tr_service_url = f"{T_BASE}/accounts/{account_id}/balance/"
    response = requests.get(tr_service_url, headers=request.headers)
    return response.json(), response.status_code





    

    
    


