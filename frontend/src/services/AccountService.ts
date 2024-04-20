import { Transaction } from "../models/Transaction";
import { Account,AccountPost } from "../models/Account";
import { PaginationResponse} from "../models/PaginationResponse";
import axios from "axios";

import  AuthorizedApi from "./AuthorizedApi"; 



const USER_ID = "f0722015-f1d6-4029-8e5e-9e0b7cf8910b"; 

const url_EX = "http://localhost:8000" 




export class AccountService extends AuthorizedApi {

  public getAll = async (): Promise<Account[]> => {
    // let instance = await this.getInstance();
    return axios
      .get( url_EX + `/users/` + USER_ID + `/accounts/` )
      .then((response) => {
        return response.data as Account[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  };

  public getById = async ( accountId: string ): Promise<Account> => { 
    //let instance = await this.getInstance();

    return axios.get( url_EX + `/users/` + USER_ID + `/accounts/` + accountId )
    .then(response => response.data as Account )
    .catch(error => Promise.reject(error) );
  };

  async addAccount(account: AccountPost): Promise<void> {
    //let instance = await this.getInstance();
    return axios.post(url_EX + `/users/` + USER_ID + `/accounts/`, account);
  }

  public getTransactions = async (
    accountId: string,
    pageNumber = 1,
    pageSize = 20,
  ): Promise<PaginationResponse<Transaction>> => {

    const res =  await this.getById(accountId)



    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions =  res.transactions.slice(startIndex, endIndex);

    const totalCount = res.transactions.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = endIndex < totalCount;

    return {
      data: paginatedTransactions,
      totalCount,
      totalPages,
      currentPage: pageNumber,
      pageSize,
      hasPreviousPage,
      hasNextPage,
    };

  };
//   public async getTotalBudget(): Promise<TotalBudgetFromWallets> {
//     const instance = await this.getInstance();
//     return instance.get(`Wallets/GetTotalBudget`).then((response) => {
//       return response.data as TotalBudgetFromWallets;
//     });
//   }
 
}