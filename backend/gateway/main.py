from flask import Flask 
import os
from flask_cors import CORS


from ocr_service import ocr_bp
from tg_service import tg_bp
from auth_service import auth_bp
from transaction_service import t_bp



app = Flask(__name__)
CORS(app)
app.register_blueprint(ocr_bp, url_prefix="/ocr")
app.register_blueprint(tg_bp, url_prefix="/telegram")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(t_bp, url_prefix="/user")
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # for example, set to 16 MB




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get("PORT"))

