import {Transaction} from "./Transaction";
import {User} from "./User";

export interface Account {
    id: string;
    name: string;
    initial_balance: number;
    currency: Currency;
    created_on: string;
    user: User; 
    transactions: Transaction[];
};

export interface AccountPost {
    name: string;
    initial_balance: number;
    created_on: string;
    currency_id: string;
};

export interface Currency { 
    id: string;
    code: string;
    name: string; 
}
