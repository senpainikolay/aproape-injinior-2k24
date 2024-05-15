import {
  Button,
  TextField,
  Typography,
  Modal,
  Autocomplete,
  Popper
} from "@mui/material";
import { showSuccessMessage, showErrorMessage } from "../../utils/toast";
import { AccountPost } from "../../models/Account";
import { onSubmitFunc } from "./AccountsComponent";
import { Field, Formik, FormikHelpers } from "formik";
import {useTranslation} from "react-i18next";
import { Currency } from "../../models/Account";


export interface AddAccountPopupProps {
  title: string;
  successMessage: string;
  currencies: Currency[];
  isUniqueAccountName: (name: string) => boolean;
  onSave: onSubmitFunc;
  isOpen: boolean;
  onClose: () => void;
  accountToUpdate?: AccountPost;
}



export const AccountPopUp = (props: AddAccountPopupProps) => {
  const {t} = useTranslation();
  const initialAccountName = "";
  const initialBalance = 10;
  const initialCurrencyID = "";

  const handleClose = () => {
    props.onClose();
  };

  const submitCallback = async (
    values: AccountPost,
    { resetForm }: FormikHelpers<AccountPost>
  ) => {
    const account: AccountPost = {
      name: values.name,
      initial_balance: 10,
      created_on: new Date().toISOString(),
      currency_id: values.currency_id

    };
    props
      .onSave(account)
      .then(() => {
        handleClose();
        showSuccessMessage();
        props.onClose();
        values.name = "";
        values.initial_balance = 10;
        values.currency_id = "";
      })
      .catch(() => {
        showErrorMessage();
      });
  };

  const validateCallback = (values: AccountPost) => {
    const errors: Partial<AccountPost> = {};
    let emptyAccountNameFieldErrorMessage: string = t('add_account_name');
    let invalidAccountNameErrorMessage: string =
      t('account_with_this_name_exists');
    if (!values.name) {
      errors.name = emptyAccountNameFieldErrorMessage;
    } else if (
      !props.isUniqueAccountName(values.name) &&
      values.name !== props.accountToUpdate?.name
    ) {
      errors.name = invalidAccountNameErrorMessage;
    }
    return errors;
  };

  return (
    <Formik
      initialValues={{
        name: initialAccountName,
        initial_balance: initialBalance,
        currency_id: initialCurrencyID,
        created_on: new Date().toISOString(),
            }}
      onSubmit={submitCallback}
      validate={validateCallback}
      enableReinitialize={true}
    >
      {(formik) => {
        return (
          <Modal style={styles.modal} open={props.isOpen} onClose={handleClose}>
            <div style={styles.container}>
              <form onSubmit={formik.handleSubmit}>
                <Typography variant="h5" style={styles.titleTypography}>
                  {props.title}
                </Typography>
                <Field
                  as={TextField}
                  style={styles.errorFieldInput}
                  id="accountName"
                  label={t('account_name')}
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={formik.values.name}
                  helperText={
                    formik.values.name && (formik.errors.name ?? "")
                  }
                  error={!!(formik.values.name && formik.errors.name)}
                  FormHelperTextProps={{ style: { marginLeft: 0 } }}
                />
                <Field
                  as={TextField}
                  style={styles.errorFieldInput}
                  id="initialBalance"
                  label={t('account_initial_balance')}
                  variant="outlined"
                  fullWidth
                  name="initial_balance"
                  value={formik.values.initial_balance}
                  helperText={formik.errors.initial_balance ?? ""}
                  error={!!formik.errors.initial_balance}
                  FormHelperTextProps={{ style: { marginLeft: 0 } }}
                />

                 <Autocomplete
                    id="currency_id"
                    options={props.currencies}
                    getOptionLabel={(option: Currency) => option.code}
                    style={styles.errorFieldInput} 
                   
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("initial_currency_code")}
                        variant="outlined"
                        fullWidth
                        name="currency_id"
                        value={formik.values.currency_id}
                        onBlur={formik.handleBlur}
                        helperText={formik.touched.currency_id && formik.errors.currency_id ? formik.errors.currency_id : ""}
                        error={formik.touched.currency_id && Boolean(formik.errors.currency_id)}
                      />
                    )}
                    onChange={(event, newValue: Currency | null) => {
                      formik.setFieldValue('currency_id', newValue ? newValue.id : '');
                    }}
                    

                    PopperComponent={(props) => (
                      <Popper {...props} anchorEl={document.getElementById('currency_id')} placement="bottom-start" />
                    )}
                   
                    />

                <div style={styles.buttons}>
                  <Button onClick={handleClose}>{t('cancel')}</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!formik.dirty || !formik.isValid || formik.isSubmitting || formik.values.currency_id == ""}
                  >
                    {t('save')}
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        );
      }}
    </Formik>
  );
};

const styles: { [key: string]: any } = {
  

  errorFieldInput: {
    marginTop: "10px",
    
  },
  addButton: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },
  titleTypography: {
    fontSize: 35,
    display: "flex",
    justifyContent: "center",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "#fff",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    padding: "24px",
    maxWidth: "500px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    "&.MuiError .MuiOutlinedInputRoot .MuiOutlinedInputNotchedOutline": {
      borderColor: "red",
      color: "red",
    },
  },
  buttons: {
    display: "flex",
    gap: "2rem",
    justifyContent: "flex-end",
    marginTop: "15px",
  },
};
