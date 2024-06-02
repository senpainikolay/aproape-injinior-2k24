import {useState} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";

import  SpendingLineChart  from "./Charts/SpendingChart";
import  BarChart  from "./Charts/BarChart";
import PieChart from "./Charts/PieChart";

import { TransactionTimeSeries} from "../models/Transaction";

import {useTranslation} from "react-i18next";
import {Container} from "@mui/material";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ITabsProps {
    balance_transactions: TransactionTimeSeries[],
    predicted_balance_transactions: TransactionTimeSeries[],
    income_transactions: TransactionTimeSeries[],
    predicted_income_transactions: TransactionTimeSeries[],
    spending_transactions: TransactionTimeSeries[],
    predicted_spending_transactions: TransactionTimeSeries[]

}

const TabsComponent = (props: ITabsProps) => {
    const [value, setValue] = useState<number>(0);
    const {t} = useTranslation();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

    const getFontSize = () => {
        if (isLargeScreen) {
            return 18; // Font size for large screens
        } else if (isMediumScreen) {
            return 16; // Font size for medium screens
        } else {
            return 12; // Font size for small screens
        }
    };
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Container maxWidth="lg"   sx={{marginTop: "10em"}}    >
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab
                        label={t('balance_tab_name')}
                        sx={{
                            ...styles.tabLabel,
                            fontSize: `${getFontSize()}px`,
                        }}
                    />
                    <Tab
                        label={t('spending_tab_name')}
                        sx={{
                            ...styles.tabLabel,
                            fontSize: `${getFontSize()}px`,
                        }}
                    />
                    <Tab
                        label={t('income_tab_name')}
                        sx={{
                            ...styles.tabLabel,
                            fontSize: `${getFontSize()}px`,
                        }}
                    />
                </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
            <div style={styles.tabContent}>

            <SpendingLineChart  transactions={props.balance_transactions} predictedTransactions={props.predicted_balance_transactions} />      
            </div>
        
            </TabPanel>

            <TabPanel value={value} index={1}>
                <div style={styles.tabContent}>
                <BarChart transactions={props.spending_transactions} predictedTransactions={props.predicted_spending_transactions} /> 
                </div>
            </TabPanel>

            <TabPanel value={value} index={2}>
                <div style={styles.tabContent}>
                <PieChart transactions={props.income_transactions} predictedTransactions={props.predicted_income_transactions} /> 
                </div>
            </TabPanel>
        </Container>
    );
};

const styles: { [key: string]: any } = {
    tabsComponent: {
        margin: "1rem 0 2rem",
        padding: '0rem 4rem',
    },
    tabLabel: {
        fontWeight: "bold",
        fontSize: "1.1rem",
        textTransform: "none",
    },
    tabContent: {
        marginTop: '1rem',
    }

};

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <div>
                        {children}
                    </div>
                </Box>
            )}
        </div>
    );
}

export default TabsComponent;