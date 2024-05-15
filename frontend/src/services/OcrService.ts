
import AuthorizedApi from "./AuthorizedApi";
import {ImgTransactionData } from "../models/Transaction";
import CryptoJS from 'crypto-js'; 

const F_SECRET='Zrgt-X5lZmllFGLp7aEZiLSgBuMto64GUofPwJnVZDE='
const H_SECRET = 'WTF'

  
export class OcrService extends AuthorizedApi {

    public async processImageInput(
      img?:File
    ): Promise<ImgTransactionData > {

    if (!img) {
            return Promise.reject()
        }

    const { encryptedData, hmac } = await encryptAndGenerateHMAC(img);

    const formData = new FormData();
    formData.append('encrypeimg', encryptedData);
    formData.append('hmac', hmac);
      const instance = await this.getInstance();
      return instance.post(`/ocr/process`, img).then(res => res.data as ImgTransactionData ).catch(err => Promise.reject(err))
    }


}
  
const encryptAndGenerateHMAC = async (imageFile: File) => {

    const base64ImageData = await convertFileToBase64(imageFile);
    const encryptedData = CryptoJS.AES.encrypt(base64ImageData, F_SECRET  ).toString();
    const hmac = CryptoJS.HmacSHA256(encryptedData, H_SECRET).toString();
    return { encryptedData, hmac };
  };
  
  const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };