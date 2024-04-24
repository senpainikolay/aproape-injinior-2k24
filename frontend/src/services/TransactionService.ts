
import {AddTransactionRequest, TransactionBalanceTimeSeries,ImgTransactionData } from "../models/Transaction";
import AuthorizedApi from "./AuthorizedApi";

import axios from "axios";


const url_ext = "http://localhost:8000" 
  
export class TransactionService extends AuthorizedApi {
   
    public async addTransaction(
      account_id : string,
      addTransactionRequest: AddTransactionRequest
    ): Promise<void> {
      //const instance = await this.getInstance();
      return axios.post( url_ext + `/accounts/` + account_id + `/transactions/`, addTransactionRequest);
    }

    public async processImageInput(
      img?:File
    ): Promise<ImgTransactionData > {
      return axios.post(`http://localhost:8001/ocr/process`, img).then(res => res.data as ImgTransactionData ).catch(err => Promise.reject(err))
    }

    public async getTransactionsTimeSeriesPerAccount(
      account_id : string = "3833dd4d-1d70-4ce2-ad1a-cd5713da25e1",
    ): Promise<TransactionBalanceTimeSeries[]> {
      // const instance = await this.getInstance();
      return axios.get( url_ext + `/accounts/` + account_id + `/balance/timeseries`)
      .then((response) => {
        return response.data as TransactionBalanceTimeSeries[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }
  
  }
  