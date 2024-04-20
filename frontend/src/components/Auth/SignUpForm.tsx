import { showSuccessMessage,showErrorMessage } from "../../utils/toast";
import { useState } from "react";
import { RegisterReq  } from "../../models/User";
import { Button, IconButton, TextField } from "@mui/material";
import { UserService } from "../../services/UserService";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FormikProps, Form, Field, withFormik, FormikErrors, FormikHelpers } from "formik";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import Grid from '@mui/material/Grid';

const userService = new UserService();
const EMAIL_FORMAT =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
const PASSWORD_FORMAT =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ !"#$%&'()*+,\-./\\:;<=>?@[\]^_`{|}~])[a-zA-Z0-9 !"#$%&'()*+,\-./\\:;<=>?@[\]^_`{|}~]{8,}$/;

interface FormValues {
  name: string;
  email: string;
  password: string;
  matchPassword: string;
  submitCallback: any;
}

interface SignUpMessageProp {
  message: string;
}

interface SignUpFormProps {
  initialName?: string;
  initialEmail?: string;
  initialPassword?: string;
  initialMatchPassword?: string;
  message: string;
  submitCallback: any;
}

const InnerForm = (props: SignUpMessageProp & FormikProps<FormValues>) => {
  const {t} = useTranslation();

  const [showPassword, setShowPassword] = useState(true);
  const { isSubmitting } = props
  const toggleShowPassword = () => {
    setShowPassword((prevState: boolean) => !prevState);
  };
  const { values, errors, message } = props;
  return (
    <Form className="form">
      <Typography sx={styles.textS} >{message}</Typography>
      <Grid container justifyContent="center">
        <Grid item xs={10} sm={10} lg={8} xl={7}>
          <Field
              as={TextField}
              style={styles.fieldInput}
              InputProps={{ sx: { height: 40 } }}
              type="text"
              name="name"
              placeholder={t('first_name')}
              helperText={values.name && (errors.name ?? "")}
              error={!!(values.name && errors.name)}
          />
        </Grid>
        <Grid item xs={10} sm={10} lg={8} xl={7}>
          <Field
              as={TextField}
              style={styles.fieldInput}
              InputProps={{ sx: { height: 40 } }}
              type="email"
              name="email"
              placeholder="Email"
              helperText={values.email && (errors.email ?? "")}
              error={!!(values.email && errors.email)}
          />
        </Grid>
        <Grid item xs={10} sm={10} lg={8} xl={7}>
          <Field
              as={TextField}
              style={styles.fieldInput}
              InputProps={{
                endAdornment: (
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                ),
                sx: { height: 40 },
              }}
              type={showPassword ? "password" : "text"}
              name="password"
              placeholder={t('password')}
              helperText={values.password && (errors.password ?? "")}
              error={!!(values.password && errors.password)}
          />
        </Grid>
        <Grid item xs={10} sm={10} lg={8} xl={7}>
          <Field
              as={TextField}
              style={styles.fieldInput}
              InputProps={{ sx: { height: 40 } }}
              variant="outlined"
              type={showPassword ? "password" : "text"}
              name="matchPassword"
              placeholder={t('confirm_password')}
              helperText={
                  values.matchPassword && (errors.matchPassword ?? "")
              }
              error={!!(values.matchPassword && errors.matchPassword)}
          />
        </Grid>
        <Grid item xs={10} sm={10} lg={8} xl={7}>
          <Button
              variant="contained"
              style={styles.button}
              type="submit"
              disabled={
                errors.name ||
                errors.email ||
                errors.password ||
                errors.matchPassword ||
                isSubmitting ? true : false
              }
          >
            {t('sign_up')}
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};


const validateCallback = (values: FormValues) => {
  let errors: FormikErrors<FormValues> = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!EMAIL_FORMAT.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.trim().length <= 1) {
    errors.name =
      `First name must have at least 2 characters`;
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (!PASSWORD_FORMAT.test(values.password)) {
    errors.password = `Password must have minimum eight characters, at least one uppercase letter, one
      lowercase letter, one number and one special character`;
  }
  if (!values.matchPassword) {
    errors.matchPassword = "Required";
  } else if (!(values.matchPassword === values.password)) {
    errors.matchPassword = "Password doesn't match.";
  }
  return errors;
}

const submitCallback = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
  const userRegReq: RegisterReq = {
    name: values.name,
    email: values.email,
    password: values.password
  };

  userService
    .register(userRegReq)
    .then(() => {
      showSuccessMessage("Succesful Registered!");
      values.submitCallback();
      setSubmitting(false);
    })
    .catch((error) => {
      console.log(error)
      showErrorMessage("User already exists!");
      setSubmitting(false);
    });
}

const SignUpForm = withFormik<SignUpFormProps, FormValues>({
  mapPropsToValues: (props) => {
    return {
      name: props.initialName || "",
      email: props.initialEmail || "",
      password: props.initialPassword || "",
      matchPassword: props.initialMatchPassword || "",
      submitCallback: props.submitCallback,
    };
  },
  validate: validateCallback,
  handleSubmit: submitCallback,
})(InnerForm);

export default SignUpForm;

const styles: { [key: string]: any } = {

  textS: { fontSize: 35, marginTop: "3em", textAlign: "center", },

  fieldInput: {
    width: "100%",
    marginTop: "10px",
  },
  button: {
    width: "100%",
    marginTop: "10px",
  },
  addButton: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },
};
