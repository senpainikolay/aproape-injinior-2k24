
import {AddTransactionRequest, TransactionBalanceTimeSeries } from "../models/Transaction";
import {Currency} from "../models/Account"
import AuthorizedApi from "./AuthorizedApi";

  
export class TransactionService extends AuthorizedApi {
   
    public async addTransaction(
      account_id : string,
      addTransactionRequest: AddTransactionRequest
    ): Promise<void> {
      const instance = await this.getInstance();
      return instance.post(`/user/accounts/` + account_id + `/transactions/`, addTransactionRequest);
    }

    public async getTransactionsTimeSeriesPerAccount(
      account_id : string,
    ): Promise<TransactionBalanceTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get( `/user/accounts/` + account_id + `/balance/timeseries`)
      .then((response) => {
        return response.data as TransactionBalanceTimeSeries[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }

    
    public async getCurrencies(): Promise<Currency[]> {
      const instance = await this.getInstance();
      return instance.get( `user/accounts/currencies`)
      .then((response) => {
        return response.data as Currency[];
      })
      .catch((error) => {
        return Promise.reject(error);
      });
    }
  
  }
  