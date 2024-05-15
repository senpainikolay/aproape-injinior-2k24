from flask import Blueprint, jsonify, request
from models import User, TokenBlocklist
import pyotp
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required,get_jwt_identity,current_user,get_jwt
import requests

import json

import os
from dotenv import load_dotenv
load_dotenv()


auth_bp = Blueprint("auth", __name__)

TR_BASE = os.environ.get("TR_BASE")



@auth_bp.post("/register")
def register_user():
    data = request.get_json()

    user = User.get_user_by_email(email=data.get("email"))

    if user is not None:
        return jsonify({"error": "User already exists"}), 409
    
    kek = requests.post(f"{TR_BASE}/users/", data= json.dumps({"first_name": data.get("name") ,"last_name": ""}), headers=request.headers)

    if kek.status_code == 200:
        new_user = User(id = kek.json().get('id'), email=data.get("email"),name=data.get("name") )
        new_user.set_password(password=data.get("password"))
        new_user.save()

        return jsonify({"message": "User created"}), 201
    else:
        return jsonify({"message": "smth wrong with registering on auth service"}), 500



@auth_bp.post("/login")
def login_user():
    data = request.get_json()

    user = User.get_user_by_email(email=data.get("email"))

    if user and (user.check_password(password=data.get("password"))):
        access_token = create_access_token(identity=user.id )
        refresh_token = create_refresh_token(identity=user.id)

        return (
            jsonify(
                {
                    "message": "Logged In ",
                    "tokens": {"access": access_token, "refresh": refresh_token},
                }
            ),
            200,
        )

    return jsonify({"error": "Invalid username or password"}), 400


@auth_bp.get("/me")
@jwt_required()
def whoami():
    return jsonify(
        {
            "name": current_user.name,
            "id": current_user.id,
        }
    )


@auth_bp.post("/generate_otp")
@jwt_required()
def generate_and_return_otp():
    data = request.get_json()
    current_user.generate_otp(data.get("tg_usrname"))
    current_user.save()
    return jsonify({"otp": current_user.otp_secret})


@auth_bp.post("/validate_otp")
def validate_otp():
    data = request.get_json()

    otp = data.get("otp")
    tg = data.get("tg_usrname")

    user = User.get_user_by_tg(tg_name=tg)

    if user is None:
        return jsonify({"error": "Telegram Username not registered."}), 405

    if  user.validate_otp(tg,otp):
        return jsonify({"message": "Valid OTP"}), 200
    else:
        return jsonify({"message": "Invalid or Expired OTP"}), 400




@auth_bp.get("/refresh")
@jwt_required(refresh=True)
def refresh_access():
    identity = get_jwt_identity()

    new_access_token = create_access_token(identity=identity)

    return jsonify({"access_token": new_access_token})


@auth_bp.get('/logout')
@jwt_required(verify_type=False) 
def logout_user():
    jwt = get_jwt()

    jti = jwt['jti']
    token_type = jwt['type']

    token_b = TokenBlocklist(jti=jti)

    token_b.save()

    return jsonify({"message": f"{token_type} token revoked successfully"}) , 200 


