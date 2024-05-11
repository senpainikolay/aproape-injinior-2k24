import {Box, Button, IconButton, Link, TextField} from "@mui/material";
import {useState} from "react";
import {LoginReq} from "../../models/User";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {showSuccessMessage, showErrorMessage} from "../../utils/toast";
import {
    FormikProps,
    Form,
    Field,
    withFormik,
    FormikErrors,
    FormikHelpers,
} from "formik";
import Typography from "@mui/material/Typography";
import { UserService } from "../../services/UserService";
import { Link as RouterLink } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import Grid from '@mui/material/Grid';

const EMAIL_FORMAT =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

interface FormValues {
    email: string;
    password: string;
    submitCallback: any;
}

interface SignUpMessageProp {
    message: string;
}

const userService = new UserService();
const InnerForm = (props: SignUpMessageProp & FormikProps<FormValues>) => {
    const {t} = useTranslation();
    const [showPassword, setShowPassword] = useState(true)
    const {isSubmitting} = props;
    const toggleShowPassword = () => {
        setShowPassword((prevState: boolean) => !prevState);
    };

    const {values, errors, message} = props;
    return (
        <Form className="form">
            <Typography sx={styles.textS} >{message}</Typography>
            <Grid container justifyContent="center">
                <Grid item xs={10} sm={10} lg={8} xl={7}>
                    <Field
                        as={TextField}
                        style={styles.fieldInput}
                        InputProps={{sx: styles.inputProps}}
                        type="email"
                        name="email"
                        label="Email"
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
                                    {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                                </IconButton>
                            ),
                            sx: styles.inputProps,
                        }}
                        type={showPassword ? 'password' : 'text'}
                        name="password"
                        label={t('password')}
                        helperText={values.password && (errors.password ?? "")}
                        error={!!(values.password && errors.password)}
                    />
                </Grid>
                <Grid item xs={10} sm={10} lg={8} xl={7}>
                    <Button
                        variant="contained"
                        style={styles.signInButton}
                        type="submit"
                        disabled={
                            errors.email ||
                            errors.password ||
                            isSubmitting ? true : false
                        }
                    >
                      {t('sign_in')}
                    </Button>
                </Grid>
                <Grid item xs={10} sm={10} lg={8} xl={7}>
                    <Box style={styles.redirectingLinks} justifyContent="space-between">
                        <Link component={RouterLink} to="/SignUp" style={styles.redirectLinkEnd}>Don't have an account? Sign Up</Link>
                    </Box>
                </Grid>
            </Grid>
        </Form>
    );
};


interface SignInFormProps {
    initialEmail?: string;
    initialPassword?: string;
    message: string;
    submitCallback: any;
}

const validateCallback = (values: FormValues) => {
    let errors: FormikErrors<FormValues> = {};
    if (!values.email) {
        errors.email = "Required";
    } else if (!EMAIL_FORMAT.test(values.email)) {
        errors.email = "Invalid email format";
    }
    if (!values.password) {
        errors.password = "Required";
    }
    return errors;
}

const submitCallback = (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>) => {
    const loginRequest: LoginReq = {
        email: values.email,
        password: values.password
    };
    userService.login(loginRequest)
        .then(() => {
            showSuccessMessage("Succesful Signed In");
            values.submitCallback();
            setSubmitting(false);
        })
        .catch((error) => {
            showErrorMessage("Invalid Credentials!");
            setSubmitting(false);
        });
}

const SignInForm = withFormik<SignInFormProps, FormValues>({
    mapPropsToValues: (props) => {
        return {
            email: props.initialEmail || "",
            password: props.initialPassword || "",
            submitCallback: props.submitCallback
        };
    },
    validate: validateCallback,
    handleSubmit: submitCallback,
})(InnerForm);

export default SignInForm


const styles: { [key: string]: any } = {
    textS: { fontSize: 35, marginTop: "3em", textAlign: "center", },

    fieldInput: {
        width: "100%",
        marginTop: "10px",
        "&.MuiError .MuiOutlinedInputRoot .MuiOutlinedInputNotchedOutline": {
            borderColor: "red",
            color: "red"
        }
    },
    inputProps: {
        height: 60,
        bgcolor: "rgb(232, 240, 253)"
    },
    signInButton: {
        width: "100%",
        marginTop: "10px"
    },
    redirectingLinks: {
        display: "flex",
        margin: "10px"
    },
    redirectLinkStart: {
        textAlign: "start"
    },
    redirectLinkEnd: {
        textAlign: "end"
    }
};

