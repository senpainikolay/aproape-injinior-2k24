import { Container, Typography } from "@mui/material";
import { AccountsCarousel } from "../components/Account/AccountsCarousel";
import {useTranslation} from "react-i18next";
import TabsComponent from "../components/TabsComponent";

import {TransactionBalanceTimeSeries} from "../models/Transaction"
import { useEffect, useState } from "react";

import {TransactionService} from "../services/TransactionService"






export const Home = () => {
    const {t} = useTranslation();

    const [transactions, setTransactions] = useState<TransactionBalanceTimeSeries[]>([]);

    const fetchTransactionsData = async () => {
        const transactionService = new TransactionService();
        const response = await transactionService.getTransactionsTimeSeriesPerAccount();
        setTransactions(response);
    };
   
   

    useEffect(() => {
      
            fetchTransactionsData();
    
    }, []);

    return (
        <Container maxWidth="lg" sx={{ marginTop: "3rem", marginBottom: "3rem"  }}>
            <Typography align="center" variant="h3" component="div" sx={styles.dashboardTitle}>
                {t('dashboard')}
            </Typography>
            <AccountsCarousel ></AccountsCarousel>
            <TabsComponent transactions={transactions} ></TabsComponent>
        </Container>

    );
}





const styles: { [key: string]: React.CSSProperties } = {
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    dashboardTitle: {
        marginBottom: "100px"
    },
    recentTransactionsTitle: {
        marginLeft: 8, marginTop: "50px", marginBottom: "25px"
    }
};