import { Autocomplete, Backdrop, Button, CircularProgress, Dialog, FormControl, InputLabel, ListItem, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FormikErrors, useFormik } from 'formik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TransactionService } from "../../services/TransactionService";
import { AddTransactionRequest, TransactionType, ImgTransactionData } from "../../models/Transaction";
import utc from "dayjs/plugin/utc";
import {useTranslation} from "react-i18next";
import { showErrorMessage } from "../../utils/toast";

export interface AddTransactionPopupProps {
    accountId: string | undefined;
    onTransactionAdded: () => void;
    onTransactionFailedToAdd: () => void;
    onClosed: () => void;
    open: boolean;
};


interface AddTransactionFormValues {
    transactionType: TransactionType;
    amount: number;
    date: dayjs.Dayjs;
    description: string;
    location: string;
    payee: string;
    image: File | undefined; 
}

const transactionService = new TransactionService();

export const AddTransactionPopup = (props: AddTransactionPopupProps) => {
    const {t} = useTranslation();
    dayjs.extend(utc);
    const [addRequestLoading, setAddRequestLoading] = useState(false);
    const [processingImage, setProcessingImage] = useState(false);

    const formik = useFormik<AddTransactionFormValues>({
        initialValues: {
            transactionType: TransactionType.Income,
            amount: 1,
            date: dayjs(),
            description: "",
            location: "",
            payee: "",
            image: undefined
        },
        validateOnChange: true,
        validate: (values: AddTransactionFormValues) => {
            const errors: FormikErrors<AddTransactionFormValues> = {};
            if (isNaN(values.amount))
                errors.amount = t('transaction_amount_valid_number') as string;
            if (values.amount < 0.5 || values.amount >= 10000000)
                errors.amount = t('transaction_amount_value_limitations') as string;
            if (!values.amount)
                errors.amount = t('required') as string;
            if (!values.date?.isValid())
                errors.date = t('date_format') as string;
            if (dayjs().isBefore(values.date))
                errors.date = t('date_future') as string;
            return errors;
        },
        onSubmit: (values: AddTransactionFormValues) => {
            if (props.accountId === undefined)
                return;
            const addTransactionRequest: AddTransactionRequest = {
                amount: Number(values.amount),
                transaction_type_id: values.transactionType == 1 ?  "fd9bf026-338a-4372-bd48-8509a47e877c" : "4a047173-0729-485f-9608-9a99dfb1c8a3",
                datetime: values.date.utc().toDate().toISOString(),
                description: values.description,
                payee: values.payee,
                location: values.location
            };
            setAddRequestLoading(true);
            transactionService.addTransaction(props.accountId, addTransactionRequest)
                .then(() => props.onTransactionAdded())
                .catch(() => props.onTransactionFailedToAdd())
                .finally(() => setAddRequestLoading(false));
        }
    });

     const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        formik.setFieldValue("image", file);
        setProcessingImage(true);

        transactionService.processImageInput(file).then((res) => 
            {
            formik.setValues({
                transactionType: TransactionType.Expense,
                amount: Number(res.total),
                date:  dayjs(res.date),
                description: "",
                location: res.address,
                payee: res.entity,
                image: undefined
            }); 
            setProcessingImage(false);
            }
        ).catch(_ => {showErrorMessage("someht wrong with img processing"); setProcessingImage(false);} )
     
        };

    useEffect(() => {
        if (props.open) {
            formik.resetForm();
            setAddRequestLoading(false);
        }
    }, [props.open]);


    return (
        <Dialog open={props.open} onClose={props.onClosed} fullWidth maxWidth="sm">
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={addRequestLoading || processingImage }
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Stack
                component="form"
                justifyContent="space-evenly"
                spacing={2}
                id="transactionType"
                onSubmit={formik.handleSubmit}
                margin={5}> 
                <FormControl>
                    <InputLabel id="type-select-label">{t('type')}</InputLabel>
                    <Select
                        label={t('type')}
                        labelId="type-select-label"
                        onChange={formik.handleChange}
                        value={formik.values.transactionType}
                        name="transactionType"
                    >
                        {
                            Object.values(TransactionType)
                                .map(Number)
                                .filter(v => !isNaN(v))
                                .map((transactionType, index) => <MenuItem value={transactionType} key={index}>{TransactionType[transactionType]}</MenuItem>)
                        }
                    </Select>
                </FormControl>
                <TextField
                    required
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    name="amount"
                    label={t('amount')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.amount && formik.errors.amount}
                    value={formik.values.amount}
                />
    
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={t('date')}
                        format="DD-MM-YYYY"
                        onChange={value => {
                            formik.setFieldTouched("date", true, true);
                            formik.setFieldValue("date", value, true);
                        }}
                        onError={(error, value) => {
                            formik.setFieldTouched("date", true, true);
                            formik.setFieldValue("date", value, true)
                        }}
                        slotProps={{
                            textField: {
                                required: true,
                                error: formik.touched.date && Boolean(formik.errors.date),
                                value: formik.values.date
                            },
                        }}
                        disableFuture={true}
                    />
                </LocalizationProvider>
                <TextField
                    name="location"
                    onChange={formik.handleChange}
                    value={formik.values.location}
                    label={t('location')}
                    multiline
                    inputProps={{ maxLength: 50 }}
                    rows={2}
                />
                  <TextField
                    name="payee"
                    onChange={formik.handleChange}
                    value={formik.values.payee}
                    label={t('payee')}
                    multiline
                    inputProps={{ maxLength: 50 }}
                    rows={2}
                />
                <TextField
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    label={t('description')}
                    multiline
                    inputProps={{ maxLength: 100 }}
                    rows={4}
                />
                 <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-image-button"
                    multiple={false}
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="upload-image-button">
                    <Button variant="contained" component="span">
                        {formik.values.image ? "Image Uploaded" : "Choose Image"}
                    </Button>
                </label>
               
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!(formik.isValid && formik.dirty)}
                >
                    {t('add_transaction')}
                </Button>
            </Stack>
        </Dialog >
    );
}
