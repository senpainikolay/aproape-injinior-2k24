import { Container, Typography } from "@mui/material";
import { AccountsCarousel } from "../components/Account/AccountsCarousel";
import {useTranslation} from "react-i18next";







export const Home = () => {
    const {t} = useTranslation();

    return (
        <Container maxWidth="lg" sx={{ marginTop: "10rem", marginBottom: "3rem"  }}>
            <Typography align="center" variant="h2" component="div" sx={styles.dashboardTitle}>
                Select an account
            </Typography>
            <AccountsCarousel ></AccountsCarousel>
        </Container>

    );
}





const styles: { [key: string]: React.CSSProperties } = {
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    dashboardTitle: {
        marginBottom: "100px"
    },
    recentTransactionsTitle: {
        marginLeft: 8, marginTop: "50px", marginBottom: "25px"
    }
};