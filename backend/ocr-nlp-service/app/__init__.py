from flask import Flask
from .ocr import ocr_bp
from flask_cors import CORS


def create_app():

    app = Flask(__name__)
    app.config.from_prefixed_env()

    CORS(app)

    app.register_blueprint(ocr_bp, url_prefix="/ocr")
    
    return app