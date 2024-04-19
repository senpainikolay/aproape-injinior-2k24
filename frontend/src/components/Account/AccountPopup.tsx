import {
  Button,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import { showSuccessMessage, showErrorMessage } from "../../utils/toast";
import { AccountPost } from "../../models/Account";
import { onSubmitFunc } from "./AccountsComponent";
import { Field, Formik, FormikHelpers } from "formik";
import {useTranslation} from "react-i18next";

export interface AddAccountPopupProps {
  title: string;
  successMessage: string;
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
      currency_id: "c61f8118-98f7-4d89-815c-4afa68e82dff"

    };
    props
      .onSave(account)
      .then(() => {
        handleClose();
        showSuccessMessage();
        props.onClose();
        values.name = "";
        values.initial_balance = 10;
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
      created_on: new Date().toISOString(),
      currency_id: "c61f8118-98f7-4d89-815c-4afa68e82dff"
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
                <div style={styles.buttons}>
                  <Button onClick={handleClose}>{t('cancel')}</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
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
    "&.Mui-error .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    "&.Mui-error .MuiOutlinedInput-root .MuiOutlinedInput-input": {
      color: "red",
    },
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
