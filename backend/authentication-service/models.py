
from extensions import db
from sqlalchemy import ForeignKey
from werkzeug.security import generate_password_hash,check_password_hash
from datetime import datetime,timedelta
import pyotp





class User(db.Model):
    __tablename__ = "user_auth"
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False, unique=True)
    tg_name = db.Column(db.String(), nullable=True, unique=True)
    otp_secret = db.Column(db.String(), nullable=True)
    otp_expiration = db.Column(db.DateTime, nullable=True)
    password = db.Column(db.Text())
    tg_account_id = db.Column(db.String())


    
    def __repr__(self):
        return f"<User {self.email}>"

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def generate_otp(self,tg_usr,tg_acc_id):
        self.otp_secret = pyotp.random_base32()
        self.tg_name = tg_usr
        self.tg_account_id = tg_acc_id
        self.otp_expiration = datetime.now() + timedelta(minutes=3)  # OTP expiration time: 3 minutes


    def validate_otp(self, tg_name, token):
        return self.otp_secret == token and datetime.now() < self.otp_expiration and tg_name == self.tg_name


    def check_password(self, password):
        return check_password_hash(self.password, password)

    @classmethod
    def get_user_by_email(cls, email):
        return cls.query.filter_by(email=email).first()
    
    @classmethod
    def get_user_by_tg(cls, tg_name):
        return cls.query.filter_by(tg_name=tg_name).first()

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"
    id = db.Column(db.Integer(), primary_key=True)
    jti = db.Column(db.String(), nullable=True)
    create_at = db.Column(db.DateTime(), default=datetime.now())

    def __repr__(self):
        return f"<Token {self.jti}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    
