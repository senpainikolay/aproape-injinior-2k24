from flask import Blueprint, jsonify, request
from models import User, TokenBlocklist
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required,get_jwt_identity,current_user,get_jwt
from datetime import datetime
auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register_user():
    data = request.get_json()

    user = User.get_user_by_email(email=data.get("email"))

    if user is not None:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(email=data.get("email"),name=data.get("name") )
    new_user.set_password(password=data.get("password"))
    new_user.save()

    return jsonify({"message": "User created"}), 201


@auth_bp.post("/login")
def login_user():
    data = request.get_json()

    user = User.get_user_by_email(email=data.get("email"))

    if user and (user.check_password(password=data.get("password"))):
        access_token = create_access_token(identity=user.id, fresh=datetime.timedelta(minutes=10))
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
            "message": "message",
            "user_details": {
                "username": current_user.name,
                "email": current_user.email,
            },
        }
    )


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