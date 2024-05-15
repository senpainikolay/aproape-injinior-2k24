from flask import Blueprint, request, redirect,jsonify
import requests
import os


from dotenv import load_dotenv
load_dotenv()


auth_bp = Blueprint("auth", __name__) 


AUTH_BASE = os.environ.get("AUTH_BASE")


@auth_bp.post("/register")
def register():

    auth_service_url = f"{AUTH_BASE}/auth/register"
    response = requests.post(auth_service_url, data=request.data, headers=request.headers)    
    
    return response.text, response.status_code
    


@auth_bp.post("/login")
def login():
    
    auth_service_url = f"{AUTH_BASE}/auth/login"
    response = requests.post(auth_service_url, data=request.data, headers=request.headers)
    
    return response.json(), response.status_code


@auth_bp.get("/me")
def me():    
    auth_service_url = f"{AUTH_BASE}/auth/me"
    response = requests.get(auth_service_url, data=request.data,headers=request.headers)
    
    return response.json(), response.status_code


@auth_bp.post("/generate_otp")
def generateotp():
    
    auth_service_url = f"{AUTH_BASE}/auth/generate_otp"
    response = requests.post(auth_service_url, data=request.data ,headers=request.headers)
    
    return response.json(), response.status_code


@auth_bp.post("/validate_otp")
def validateotp():
    
    auth_service_url = f"{AUTH_BASE}/auth/validate_otp"
    response = requests.post(auth_service_url, data=request.data,headers=request.headers)
    
    return response.json(), response.status_code



@auth_bp.get("/refresh")
def refreshtoken():
    
    auth_service_url = f"{AUTH_BASE}/auth/refresh"
    response = requests.get(auth_service_url, data=request.data ,headers=request.headers)
    
    return response.json(), response.status_code



@auth_bp.post("/logout")
def logout():
    
    auth_service_url = f"{AUTH_BASE}/auth/logout"
    response = requests.post(auth_service_url, data=request.data ,headers=request.headers)
    
    return response.json(), response.status_code

    
