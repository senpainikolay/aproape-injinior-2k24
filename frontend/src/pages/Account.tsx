import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AccountComponent } from '../components/Account/AccountComponent';
import { Account } from "../models/Account";
import { AccountService } from '../services/AccountService';

const accountService = new AccountService();

export const AccountPage = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [account, setAccount] = useState<Account | undefined>();
    const accountId = String(id);
    useEffect(() => {
        if (accountId != "") {
            setIsLoading(true);
            accountService.getById(accountId)
                .then(value => setAccount(value) )
                .catch(() => setAccount(undefined))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <div>
            <AccountComponent
                accountId={accountId}
                account={account}
                loading={isLoading} />
        </div>

    );
}
