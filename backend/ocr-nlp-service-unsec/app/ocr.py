
from flask import Blueprint, request, jsonify
from .extensions import OCR_ENGINE, ImagePreProcessor, OCRDataProcessor,SPACY_NLP_MODEL



ocr_bp = Blueprint("ocr", __name__) 

IMG_PROCESSOR = ImagePreProcessor()



@ocr_bp.post("/process")
def process_img():
    try:
        data = request.files['img']
        img_bytes = data.read()
        img = IMG_PROCESSOR.apply_changes(img_bytes)

        ocr_res  =   OCR_ENGINE.ocr(img)[0]
        response = OCRDataProcessor( ocr_res, SPACY_NLP_MODEL, img.shape[0] / img.shape[1] ).apply_NER()
        return jsonify(response)
    except Exception as e:
        return jsonify({"err": "Either failed or security concerns" })
        

    
    


