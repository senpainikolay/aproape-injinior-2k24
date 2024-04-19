
import {AddTransactionRequest, TransactionBalanceTimeSeries,ImgTransactionData } from "../models/Transaction";
import AuthorizedApi from "./AuthorizedApi";

import axios from "axios";


  
  export class TransactionService extends AuthorizedApi {
   
    public async addTransaction(
      account_id : string,
      addTransactionRequest: AddTransactionRequest
    ): Promise<void> {
      const instance = await this.getInstance();
      return instance.post(`/accounts/` + account_id + `/transactions/`, addTransactionRequest);
    }

    public async processImageInput(
      img?:File
    ): Promise<ImgTransactionData> {
      return axios.post(`http://localhost:8001/processImage/`, img).then(res => res.data["data"] as ImgTransactionData ).catch(err => Promise.reject(err))
    }

    public async getTransactionsTimeSeriesPerAccount(
      account_id : string = "3833dd4d-1d70-4ce2-ad1a-cd5713da25e1",
    ): Promise<TransactionBalanceTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get(`/accounts/` + account_id + `/balance/timeseries`)
      .then((response) => {
        return response.data as TransactionBalanceTimeSeries[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }
  
  }
  