
export enum TransactionType {
    Income,
    Expense
};

export interface Transaction  {
    id?: string;
    transaction_type: TransactionEntity;
    amount: number;
    datetime: string;
    description: string | undefined;
    payee: string;
    location: string; 
    transaction_type_id?: string;
};

export interface ImgTransactionData  {
    entity: string;
    total: string;
    payment_method: string;
    date: string;
    address: string
};

export interface TransactionEntity {
    id: string; 
    name: string;
};

export interface TransactionBalanceTimeSeries{
    datetime: string;
    balance: string;
};
export interface TransactionTimeSeries{
    datetime: string;
    sum: string;
};


export interface PredictModel{
    ds: string;
    yhat: string;
};


export interface TransactionSpendingTimeSeries{
    datetime: string;
    spent_amount: string;
};

export interface TransactionIncomeTimeSeries{
    datetime: string;
    total_income: string;
};




export interface AddTransactionRequest { 
    transaction_type_id: string;
    amount: number;
    datetime: string;
    description: string | undefined;
    payee: string;
    location: string;

}

