import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import AccountsComponent from "../components/Account/AccountsComponent";
import { Account, AccountPost, Currency } from "../models/Account";
import { TransactionService } from "../services/TransactionService";

export const Accounts = ()  => {
    const accountService = new AccountService();
    const transactionService = new TransactionService();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const response = await accountService.getAll();
        const response2 = await transactionService.getCurrencies();
        setAccounts(response);
        setCurrencies(response2);
        setLoading(false);


    };



    useEffect(() => {
        fetchData();
    }, []);

    const handleIsUniqueAccountName = (name: string): boolean => {
        let isUnique: boolean = true;

        for (let account of accounts) {
            if (account.name === name) {
                isUnique = false;
                break;
            }
        };

        return isUnique;
    };

    const handleAccountAdded = async (account: AccountPost): Promise<void> => {
        accountService.addAccount(account).then(() => {
            fetchData();
            return Promise.resolve();
        }).catch(err => Promise.reject(err));
    }


    return (
        <div>
            <AccountsComponent
                accounts={accounts}
                currencies={currencies}
                loading={loading}
                isUniqueAccountName={handleIsUniqueAccountName}
                onAccountAdded={handleAccountAdded}
            />
        </div>
    )
}