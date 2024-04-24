import numpy as np
import imutils
from PIL import Image
import re
from paddleocr import PaddleOCR
import spacy
import os,io
from dotenv import load_dotenv
load_dotenv()


OCR_ENGINE = PaddleOCR(use_angle_cls=True, use_space_char=True)
SPACY_NLP_MODEL  = spacy.load(str(os.environ.get("NLP_CORPUS_MODEL")))




class ImageProcessor:    
    def apply_changes(self,img):
        image_np = np.array(Image.open(io.BytesIO(img)))
        return self.__orient_vertical(image_np)
    
    def __orient_vertical(self,img):
        width = img.shape[1]
        height = img.shape[0]
        if width > height:
            rotated = imutils.rotate(img, angle=270)
        else:
            rotated = img
        return rotated
    


class OCRDataProcessor:
    def __init__(self, ocr_result, nlp, img_ratio):
        self.nlp = nlp

        self.__img_ratio = img_ratio
    
        self.__date_pattern = re.compile(r'\d+-\d{2}-\d+')
        self.__digits_pattern = re.compile(r'\d+\.\d+')
        self.text_arr = self.__restructure_text(ocr_result) 

    
    def apply_NER(self):
        res_dict = {}
        res_dict["entity"] = self.__get_company()
        res_dict["total"] = self.__get_total()
        res_dict["payment_method"] = self.__get_payment_method()
        res_dict["date"] = self.__get_date()
        res_dict["address"] = self.__get_address()
        return res_dict

       
    def __restructure_text(self, ocr_result ):

        txt_arr = [ocr_result[0][1][0]]

        bounding_box_distance_index = 15 * 4 
        bounding_box_y_reducer = lambda x, y: abs(x[0][1] - y[0][1]) + abs( x[1][1] - y[1][1]) + abs( x[2][1] - y[2][1]) + abs( x[3][1] - y[3][1])

        for i in range(1,len(ocr_result)):
            prev_coords = ocr_result[i-1][0]
            coords = ocr_result[i][0]    
            res = bounding_box_y_reducer(prev_coords,coords) 

            if res <= bounding_box_distance_index * self.__img_ratio:
                txt_arr[-1] += " " + str(ocr_result[i][1][0])
            else:
                txt_arr.append( str(ocr_result[i][1][0]))
        return txt_arr
    
    
    def __get_company(self):
        first_3_s = self.text_arr[:3]
        scores = [self.nlp(sentence).similarity(self.nlp('SRL S.R.L. IM SA AO')) for sentence in first_3_s]
        if len(scores) != 0:
            return first_3_s[scores.index(max(scores))]
        else:
            ""
    

    def __get_payment_method(self):
        for w in self.text_arr:
            if "card" in w.lower():
                return "CARD"
        return "CASH" 
    

    def __get_total(self):

        scores = [self.nlp(w).similarity(self.nlp('TOTAL')) for w in self.text_arr] 
        total = self.text_arr[scores.index(max(scores))]
        digits_matches = self.__digits_pattern.findall(total)
        if len(digits_matches) != 0:
            return digits_matches[-1]
        else:

            return ""
    
    def __get_date(self):
        text =  "\n".join(self.text_arr)
        matches = self.__date_pattern.findall(text)
        if len(matches) != 0:
            return matches[0][:10]
        else:
            return ""
    
    def __get_address(self):
        text =  "\n".join(self.text_arr)   
        loc = ""
        for entity in self.nlp(text).ents:
            if entity.label_ == "LOC":
                loc += str(entity)
        return loc