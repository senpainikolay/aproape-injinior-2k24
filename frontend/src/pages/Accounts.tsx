import { useState, useEffect } from "react";
import { AccountService } from "../services/AccountService";
import AccountsComponent from "../components/Account/AccountsComponent";
import { Account, AccountPost } from "../models/Account";

export const Accounts = ()  => {
    const accountService = new AccountService();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const response = await accountService.getAll();
        setAccounts(response);
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
                loading={loading}
                isUniqueAccountName={handleIsUniqueAccountName}
                onAccountAdded={handleAccountAdded}
            />
        </div>
    )
}