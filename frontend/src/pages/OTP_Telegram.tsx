import React, { useState,useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Grid, TextField, Typography, Autocomplete} from "@mui/material";
import { UserService } from "../services/UserService";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";






const userService = new UserService(); 
const accountService = new AccountService();



const OTPForm: React.FC = () => {
  const [otp, setOTP] = useState<string>("");
  const [accounts, setAccounts] = useState<Account[]>([]);


  useEffect(() => {
    accountService.getAll().then(res => setAccounts(res))
}, []);





  const handleSubmit = async (values: { text: string; account_id: string }) => {
    try {
      const otpReq = { tg_usrname: values.text, account_id: values.account_id };
      console.log(otpReq);
      const response = await userService.generateOTP(otpReq);
      setOTP(response.otp);
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh", padding: 20 }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Enter Telegram Username:
        </Typography>
        <Formik
          initialValues={{ text: "", account_id: "" }}
          validate={(values) => {
            const errors: { text?: string; account_id?: string } = {};
            if (!values.text) {
              errors.text = "Required";
            }
            if (!values.account_id) {
              errors.account_id = "Required";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    type="text"
                    name="text"
                    label="Telegram Username"
                    variant="outlined"
                    fullWidth
                  />
                  <ErrorMessage name="text" component="div" />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={accounts}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => setFieldValue("account_id", value?.id || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Account"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Generate OTP
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        {otp && (
          <Typography
            variant="subtitle1"
            align="center"
            style={{
              marginTop: 20,
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 5,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            Generated OTP: {otp}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default OTPForm;
