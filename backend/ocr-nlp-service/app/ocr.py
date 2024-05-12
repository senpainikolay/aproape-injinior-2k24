
from flask import Blueprint, request, jsonify
from .utils import verify_hmac, decrypt_data
from .extensions import OCR_ENGINE, ImagePreProcessor, OCRDataProcessor,SPACY_NLP_MODEL



ocr_bp = Blueprint("ocr", __name__) 

IMG_PROCESSOR = ImagePreProcessor()



@ocr_bp.post("/process")
def process_img():
    encrypted_data = request.form['enimg']
    received_hmac = request.form['hmac']

    if not verify_hmac(encrypted_data.encode(), received_hmac):
        return jsonify({'error': 'HMAC verification failed'}), 400

    decrypted_img = decrypt_data(encrypted_data.encode())

    img = IMG_PROCESSOR.apply_changes(decrypted_img)

    ocr_res  =   OCR_ENGINE.ocr(img)[0]
    response = OCRDataProcessor( ocr_res, SPACY_NLP_MODEL, img.shape[0] / img.shape[1] ).apply_NER()
  
    return jsonify(response)
    
    


