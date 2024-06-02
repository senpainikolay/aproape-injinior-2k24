import { Transaction } from "../models/Transaction";
import { Account,AccountPost } from "../models/Account";
import { PaginationResponse} from "../models/PaginationResponse";
import  AuthorizedApi from "./AuthorizedApi"; 

export class AccountService extends AuthorizedApi {

  public getAll = async (): Promise<Account[]> => {
    let instance = await this.getInstance();
    return instance
      .get(`/user/accounts` )
      .then((response) => {
        return response.data as Account[];
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  };

  public getById = async ( accountId: string ): Promise<Account> => { 
    let instance = await this.getInstance();

    return instance.get( `/user/account/` + accountId )
    .then(response => response.data as Account )
    .catch(error => Promise.reject(error) );
  };

  async addAccount(account: AccountPost): Promise<void> {
    let instance = await this.getInstance();
    return instance.post(`/user/accounts`, account);
  }

  public getTransactions = async (
    accountId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginationResponse<Transaction>> => { 

    let instance = await this.getInstance();

    return instance.get(`/user/accounts/` + accountId + "/transactions" + "?page=" +  String(pageNumber) +  "&limit=" + String(pageSize)  )
    .then(response => {
      console.log(response)


    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions =  response.data["transactions"]

    const totalCount = response.data["transaction_count"]
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



    })
    .catch(error => { console.log(error); return Promise.reject(error);  } );

  };
//   public async getTotalBudget(): Promise<TotalBudgetFromWallets> {
//     const instance = await this.getInstance();
//     return instance.get(`Wallets/GetTotalBudget`).then((response) => {
//       return response.data as TotalBudgetFromWallets;
//     });
//   }
 
}