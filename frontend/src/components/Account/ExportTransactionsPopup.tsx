import { Backdrop, Button, CircularProgress, Dialog, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { AccountService } from "../../services/AccountService";
import { FileFormat, exportTransactions } from "../../utils/exportTransactions";
import {useTranslation} from "react-i18next";

export interface ExportTransactionsPopupProps {
    accountId: string | undefined;
    open: boolean;
    onClosed: () => void;
};

const accountService = new AccountService();

export const ExportTransactionsPopup = (props: ExportTransactionsPopupProps) => {
    const {t} = useTranslation();
    const [exportDataLoading, setExportDataLoading] = useState(false);
    const [fileFormat, setFileFormat] = useState(FileFormat.CSV);
    const fileName = "transactions";
    const closeDialog = () => {
        props.onClosed();
        setFileFormat(FileFormat.CSV);
    };
    const exportData = () => {
        if (props.accountId === undefined) {
            return;
        }
        setExportDataLoading(true);
        accountService.getById(props.accountId)
            .then(res => exportTransactions(res.transactions, fileFormat, fileName))
            .finally(() => {
                setExportDataLoading(false);
                closeDialog();
            });
    }
    return (
        <Dialog
            open={props.open}
            onClose={closeDialog}
            fullWidth
        >
            <DialogTitle>{t('export_transaction_data')}</DialogTitle>
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={exportDataLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Stack
                margin={5}
                spacing={2}
            >
                <Typography>{t('select_file_type')}</Typography>
                <FormControl fullWidth>
                    <InputLabel id="file-format-label">{t('file_format')}</InputLabel>
                    <Select
                        labelId="file-format-label"
                        id="file-format"
                        value={fileFormat}
                        label={t('file_format')}
                        onChange={(event) => setFileFormat(event.target.value as FileFormat)}
                    >
                        {Object.values(FileFormat)
                            .map(Number)
                            .filter(v => !isNaN(v))
                            .map((fileFormat, index) => <MenuItem value={fileFormat} key={index}>{FileFormat[fileFormat]}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                >
                    <Button onClick={closeDialog}>{t('cancel')}</Button>
                    <Button variant="contained" onClick={exportData}>{t('export')}</Button>
                </Stack>
            </Stack>
        </Dialog >
    );
};
