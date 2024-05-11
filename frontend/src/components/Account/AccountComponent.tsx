import {Account} from "../../models/Account";

import {Transaction} from "../../models/Transaction";
import {ExportTransactionsPopup, ExportTransactionsPopupProps} from "./ExportTransactionsPopup";

import {PaginationResponse} from "../../models/PaginationResponse"

import dayjs from "dayjs";

import {AddTransactionPopup, AddTransactionPopupProps} from '../Transaction/AddTransactionPopup';
import {useEffect, useState} from 'react';
import {showSuccessMessage, showErrorMessage} from "../../utils/toast";
import {AccountService} from "../../services/AccountService";
import {useTranslation} from "react-i18next";


import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';


interface IAccountComponentProps {
    accountId: string;
    account: Account | undefined;
    loading: boolean;
}

const accountService = new AccountService();
export const AccountComponent = (props: IAccountComponentProps) => {
    const {t} = useTranslation();
    const [isTransactionPopupOpen, setIsTransactionPopupOpen] = useState(false);
    const [isExportTransactionsPopupOpen, setIsExportTransactionsPopupOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [transactionPage, setTransactionPage] = useState<PaginationResponse<Transaction>>();
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [page, setPage] = useState(0);




    const fetchTransactions = () => {
        if (props.accountId == "") {
            return;
        }
        setDataIsLoading(true);
        accountService.getTransactions(props.accountId, page + 1, rowsPerPage)
            .then(value => {
                setPage(Math.max(0, Math.min(page, value.totalPages - 1)));
                setTransactionPage(value);
            })
            .finally(() => setDataIsLoading(false));
    };

    const transactionPopupProps: AddTransactionPopupProps = {
        accountId: props.accountId,
        onTransactionAdded: () => {
            setIsTransactionPopupOpen(false);
            showSuccessMessage(t('transaction_add_success') as string);
            fetchTransactions();
            if (props.account === undefined) {
                return;
            }
        },
        onTransactionFailedToAdd: () => {
            setIsTransactionPopupOpen(false);
            showErrorMessage(t('transaction_add_fail') as string);
        },
        open: isTransactionPopupOpen,
        onClosed: () => {
            setIsTransactionPopupOpen(false);
        }
    };
    const exportTransactionsPopupProps: ExportTransactionsPopupProps = {
        accountId: props.accountId,
        open: isExportTransactionsPopupOpen,
        onClosed: () => {
            setIsExportTransactionsPopupOpen(false);
        },
    };
    useEffect(() => {
        fetchTransactions();
    }, [page, rowsPerPage, props.accountId]);


    return (
        <Container style={styles.accountComponent}>
            {props.loading
                ?
                <Box sx={styles.accountLoadingBox}>
                    <CircularProgress/>
                </Box>
                :
                (props.account !== undefined
                        ?
                        <>
                            <Typography variant="h4">{props.account.name}</Typography>
                            <Button sx={styles.exportButton} variant="contained"
                                    onClick={() => setIsExportTransactionsPopupOpen(true)}>{t('export_data')}</Button>
                            <ExportTransactionsPopup {...exportTransactionsPopupProps} />
                            <Paper sx={styles.paper}>
                                <Backdrop open={dataIsLoading} sx={styles.progress}>
                                    <CircularProgress/>
                                </Backdrop>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{t('date')}</TableCell>
                                                <TableCell>{t('type')}</TableCell>
                                                <TableCell>{t('payee')}</TableCell>
                                                <TableCell>{t('amount')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                !(transactionPage?.data !== undefined && transactionPage?.data.length > 0) &&
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" sx={styles.emptyCell}>No
                                                        transactions found</TableCell>
                                                </TableRow>
                                            }
                                            {transactionPage?.data.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{dayjs(row.datetime).format("YYYY-MM-DD")}</TableCell>
                                                    <TableCell>{row.transaction_type.name}</TableCell>
                                                    <TableCell>{row.payee}</TableCell>
                                                    <TableCell>{row.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    showFirstButton={true}
                                    showLastButton={true}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    component="div"
                                    count={transactionPage ? transactionPage?.totalCount : 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(event, page) => setPage(page)}
                                    onRowsPerPageChange={(event) => {
                                        setRowsPerPage(Number(event.target.value));
                                        setPage(0);
                                    }}
                                />
                            </Paper>

                            <AddTransactionPopup {...transactionPopupProps} />
                            <Button variant="contained"
                                    onClick={() => setIsTransactionPopupOpen(true)}>{t('add_transaction')}</Button>

                        </>
                        :
                        <Typography>{t('no_account_found')}</Typography>
                )
            }
        </Container>
    )
};



const styles: { [key: string]: React.CSSProperties } = {
    accountLoadingBox: {
        display: "flex",
        justifyContent: "center"
    },
    exportButton: {
        marginTop: "1rem",
        marginBottom: "1rem",
    },
    accountComponent: {
        marginTop: "3rem"
    },
    paper: {
        position: 'relative',
        marginTop: "1rem",
        marginBottom: "1rem",
    },
    emptyCell: {
        fontSize: "18pt"
    },
    progress: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    }
};
