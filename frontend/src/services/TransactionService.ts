
import {AddTransactionRequest, TransactionBalanceTimeSeries,TransactionIncomeTimeSeries,TransactionSpendingTimeSeries,PredictModel, TransactionTimeSeries } from "../models/Transaction";
import {Currency} from "../models/Account"
import AuthorizedApi from "./AuthorizedApi";

  
export class TransactionService extends AuthorizedApi {
   
    public async addTransaction(
      account_id : string,
      addTransactionRequest: AddTransactionRequest
    ): Promise<void> {
      const instance = await this.getInstance();
      return instance.post(`/user/accounts/` + account_id + `/transactions`, addTransactionRequest);
    }

    public async getBalanceTimeSeriesPerAccount(
      account_id : string,
    ): Promise<TransactionTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get( `/user/accounts/` + account_id + `/balance/timeseries`)
      .then((response) => {
        const transformedData : TransactionTimeSeries[]  = response.data.map((item: TransactionBalanceTimeSeries) => ({
          datetime: item.datetime,
          sum: item.balance
        }));

        return transformedData as TransactionTimeSeries[];
        
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }
    
    public async getBalancePredictionTimeSeriesPerAccount(
      account_id : string,
    ): Promise<TransactionTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get( `/user/accounts/` + account_id + `/balance/timeseries/predictions`)
      .then((response) => {

        const transformedData : TransactionTimeSeries[]  = response.data.map((item: PredictModel) => ({
          datetime: item.ds,
          sum: item.yhat
        }));
        
        return transformedData as TransactionTimeSeries[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }

    public async getIncomeTimeSeriesPerAccount(
      account_id : string,
    ): Promise<TransactionTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get( `/user/accounts/` + account_id + `/income/timeseries`)
      .then((response) => {
        const transformedData : TransactionTimeSeries[]  = response.data.map((item:TransactionIncomeTimeSeries ) => ({
          datetime: item.datetime,
          sum: item.total_income
        }));
        
        return transformedData as TransactionTimeSeries[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }

    public async getIncomePredictionTimeSeriesPerAccount(
      account_id : string,
    ): Promise<TransactionTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get( `/user/accounts/` + account_id + `/income/timeseries/predictions`)
      .then((response) => {

        const transformedData : TransactionTimeSeries[]  = response.data.map((item: PredictModel) => ({
          datetime: item.ds,
          sum: item.yhat
        }));
        
        return transformedData as TransactionTimeSeries[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }

    public async getSpendingTimeSeriesPerAccount(
      account_id : string,
    ): Promise<TransactionTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get( `/user/accounts/` + account_id + `/spending/timeseries`)
      .then((response) => {
        const transformedData : TransactionTimeSeries[]  = response.data.map((item:TransactionSpendingTimeSeries ) => ({
          datetime: item.datetime,
          sum: item.spent_amount
        }));
        
        return transformedData as TransactionTimeSeries[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
    }

    public async getSpendingPredictionTimeSeriesPerAccount(
      account_id : string,
    ): Promise<TransactionTimeSeries[]> {
      const instance = await this.getInstance();
      return instance.get( `/user/accounts/` + account_id + `/spending/timeseries/predictions`)
      .then((response) => {

        const transformedData : TransactionTimeSeries[]  = response.data.map((item: PredictModel) => ({
          datetime: item.ds,
          sum: item.yhat
        }));
        
        return transformedData as TransactionTimeSeries[];
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
  