
from flask import Blueprint, request, jsonify
from .utils import verify_hmac, decrypt_data
from .extensions import OCR_ENGINE, ImagePreProcessor, OCRDataProcessor,SPACY_NLP_MODEL



ocr_bp = Blueprint("ocr", __name__) 

IMG_PROCESSOR = ImagePreProcessor()



@ocr_bp.post("/process")
def process_img():
    data = request.files['img']
    img_bytes = data.read()
    #encrypted_data = request.json['image']
    #received_hmac = request.json['hmac']

    #decrypted_data = decrypt_data(encrypted_data)

    
    #if not verify_hmac(decrypted_data, received_hmac):
    #    return jsonify({'error': 'HMAC verification failed'}), 400

    img = IMG_PROCESSOR.apply_changes(img_bytes) # decrypted_data 


    ocr_res  =   OCR_ENGINE.ocr(img)[0]
    response = OCRDataProcessor( ocr_res, SPACY_NLP_MODEL, img.shape[0] / img.shape[1] ).apply_NER()
  
    return jsonify(response)
    
    


