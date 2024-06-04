import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AccountComponent } from '../components/Account/AccountComponent';
import { Account } from "../models/Account";
import { AccountService } from '../services/AccountService';
import TabsComponent from "../components/TabsComponent"; 
import { Container } from "@mui/material";

import {TransactionTimeSeries} from "../models/Transaction"

import {TransactionService} from "../services/TransactionService"

import {
    Box,
    CircularProgress
} from '@mui/material';

const accountService = new AccountService();
const transactionService = new TransactionService();


export const AccountPage = () => {    
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [account, setAccount] = useState<Account | undefined>();
    const accountId = String(id);

    const [transactionsBalance, setTransactionsBalance] = useState<TransactionTimeSeries[]>([]);
    const [transactionsBalancePredicted, setTransactionsBalancePredicted] = useState<TransactionTimeSeries[]>([]);

    const [transactionsSpending, setTransactionsSpending] = useState<TransactionTimeSeries[]>([]);
    const [transactionsSpendingPredicted, setTransactionsSpendingPredicted] = useState<TransactionTimeSeries[]>([]);

    const [transactionsIncome, setTransactionsIncome] = useState<TransactionTimeSeries[]>([]);
    const [transactionsIncomePredicted, setTransactionsIncomePredicted] = useState<TransactionTimeSeries[]>([]);





    const fetchTransactionsData = async () => {
        const bl_response = await transactionService.getBalanceTimeSeriesPerAccount(accountId);
        setTransactionsBalance(bl_response);
        const predicted_bl_response = await transactionService.getBalancePredictionTimeSeriesPerAccount(accountId);
        setTransactionsBalancePredicted(predicted_bl_response);
        const in_response = await transactionService.getIncomeTimeSeriesPerAccount(accountId);
        setTransactionsIncome(in_response);
        const predicted_in_response = await transactionService.getIncomePredictionTimeSeriesPerAccount(accountId);
        setTransactionsIncomePredicted(predicted_in_response);
        const sp_response = await transactionService.getSpendingTimeSeriesPerAccount(accountId);
        setTransactionsSpending(sp_response);
        const predicted_sp_response = await transactionService.getSpendingPredictionTimeSeriesPerAccount(accountId);
        const predicted_sp_response_sliced = predicted_sp_response.slice(0,90)
        setTransactionsSpendingPredicted(predicted_sp_response_sliced);
        
    };
   

    useEffect(() => {
        if (accountId != "") {
            setIsLoading(true);
            accountService.getById(accountId)
                .then(value => setAccount(value) )
                .catch(() => setAccount(undefined));
                fetchTransactionsData();
                setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, []);

    return (      
        <Container maxWidth="lg" sx={{ marginTop: "3rem", marginBottom: "3rem"  }}>

    
          {
          isLoading ? 
                <Box sx={styles.accountLoadingBox}>
                <CircularProgress/>
                </Box>
                :
            <div>
            <AccountComponent
                loading={isLoading}
                accountId={accountId}
                account={account} 
                /> 
            <TabsComponent 
            balance_transactions={transactionsBalance} 
            income_transactions={transactionsIncome} 
            spending_transactions={transactionsSpending} 
            predicted_balance_transactions={transactionsBalancePredicted} 
            predicted_income_transactions={transactionsIncomePredicted}
            predicted_spending_transactions={transactionsSpendingPredicted}
            ></TabsComponent>
            </div>
          }
       </Container>


    );
}


const styles: { [key: string]: React.CSSProperties } = {
    accountLoadingBox: {
        display: "flex",
        justifyContent: "center"
    }
};

