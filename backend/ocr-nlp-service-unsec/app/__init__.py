from flask import Flask
from .ocr import ocr_bp
from flask_cors import CORS


def create_app():

    app = Flask(__name__)
    app.config.from_prefixed_env()
    app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # for example, set to 16 MB


    CORS(app)

    app.register_blueprint(ocr_bp, url_prefix="/ocr")
    
    return app