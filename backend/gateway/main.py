from flask import Flask 
import os

from ocr_service import ocr_bp
from tg_service import tg_bp
from auth_service import auth_bp



app = Flask(__name__)
app.register_blueprint(ocr_bp, url_prefix="/ocr")
app.register_blueprint(tg_bp, url_prefix="/telegram")
app.register_blueprint(auth_bp, url_prefix="/auth")



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get("PORT"))

