import React from "react";
import {
    Alert,
    Box,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Typography,
    Fab,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info"
import {Account,AccountPost } from "../../models/Account";
import {AccountPopUp} from "./AccountPopup";
import {useNavigate} from "react-router-dom";
import Grid from '@mui/material/Grid';
import {useTranslation} from "react-i18next";
import { Currency } from "../../models/Account";


export type onSubmitFunc = (account: AccountPost) => Promise<void>



interface IAccountsComponentProps {
    accounts: Account[];
    currencies: Currency[];
    loading: boolean;
    isUniqueAccountName: (name: string) => boolean;
    onAccountAdded: onSubmitFunc;
}

export default function AccountsComponent(
    props: IAccountsComponentProps
) {
  const {t} = useTranslation();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(true);
    const [openPopupCreate, setOpenPopupCreate] = React.useState(false);
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleClickOpenPopupCreate = () => {
        setOpenPopupCreate(true);

    };


    return (
        <Grid container justifyContent="center" style={styles.gridTop}>
            <Grid item xs={10} sm={10} lg={8} xl={7}>
                <Typography variant="h5">{t('accounts')}</Typography>
            </Grid>
            <Grid item xs={10} sm={10} lg={8} xl={7}>
                {props.loading
                    ?
                    (<Box sx={{display: "flex", justifyContent: "center"}}>
                        <CircularProgress/>
                    </Box>)
                    :
                    (<List dense={false}>
                            {props.accounts.length === 0
                                ?
                                (<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                    <Alert
                                        onClose={handleClose}
                                        severity="info"
                                        sx={{width: "100%"}}
                                    >
                                      {t('no_accounts')}
                                    </Alert>
                                </Snackbar>)
                                :
                                (props.accounts.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <div>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="info"
                                                    onClick={() => navigate(`${item.id}`)}
                                                >
                                                    <InfoIcon/>
                                                </IconButton>
                                            </div>
                                        }
                                    >
                                        <ListItemText
                                            primary={item.name}
                                            secondary={
                                                item.currency.name ? `${t('Currency')}: ${item.currency.code }` : ""
                                            }
                                        />
                                    </ListItem>
                                )))}
                            <Box style={styles.addButton}>
                                <Fab
                                    color="primary"
                                    aria-label="add"
                                    onClick={handleClickOpenPopupCreate}
                                >
                                    <AddIcon/>
                                </Fab>
                            </Box>
                            <AccountPopUp
                                title={t('add_account')}
                                successMessage={t('account_add_success')}
                                isOpen={openPopupCreate}
                                onClose={() => setOpenPopupCreate(false)}
                                isUniqueAccountName={props.isUniqueAccountName}
                                onSave={props.onAccountAdded}
                                currencies={props.currencies}
                            />
                        </List>
                    )}
            </Grid>
        </Grid>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    gridTop: {
        marginTop: " 50px",
    },
    addButton: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "1rem",
    },
};
