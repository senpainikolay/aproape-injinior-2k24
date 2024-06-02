import { CardContent, Grid, Paper, Typography } from "@mui/material";
import { Account } from "../../models/Account"
import React from "react";
import { useNavigate } from "react-router-dom";

export interface CarouselItemProps {
    item: Account;
}


export const AccountCarouselItem = (props: CarouselItemProps) => {
    const navigate = useNavigate();

    return (
        <Grid item xs={6}>
            <Paper onClick={() => {
                navigate('/accounts/' + props.item.id)
            }} variant="outlined" sx={styles.accounts}>
                <React.Fragment>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {props.item.name}
                        </Typography>
                        <Typography sx={styles.balanceText} color="text.secondary">
                            {props.item.currency.code}
                        </Typography>
                    </CardContent>
                </React.Fragment>
            </Paper>
        </Grid>
    )
}


const styles: { [key: string]: any } = {
    accounts: {
        height: 100,
        borderBottom: "2px solid grey",
        cursor: "pointer"
    },
    balanceText: {
        mb: 3.0
    }
};