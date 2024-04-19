import Carousel from "react-material-ui-carousel"
import { AccountCarouselItem } from "./AccountCarouselItem"
import { Card, Grid } from "@mui/material"
import { AccountService } from "../../services/AccountService";
import { useEffect, useState } from "react";
import { Account } from "../../models/Account";


export const AccountsCarousel = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);

    const fetchData = async () => {
        const accountService = new AccountService();
        const response = await accountService.getAll();
        setAccounts(response);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const nrOfItems: number = accounts.length > 2 ? 2 : accounts.length;
    const sliderItems: Array<any> = [];

    for (let i = 0; i < accounts.length; i += nrOfItems) {
        if (i % nrOfItems === 0) {
            sliderItems.push(
                <Card key={i.toString()} sx={styles.generalCard}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            {accounts.slice(i, i + nrOfItems).map((item, index) => {
                                return <AccountCarouselItem key={index.toString()} item={item} />;
                            })}
                        </Grid>
                    </Grid>
                </Card>
            );
        }
    }

    const result = accounts.length <= 2
        ?
        sliderItems
        :
        <Carousel 
            sx={{marginBottom : "100px"}}
            autoPlay={false}
            navButtonsAlwaysVisible={true}
            navButtonsProps={{
                style: styles.navButtons
            }}>
            {sliderItems}
        </Carousel>

    return (
        <div>
            {result}
        </div>
    )
}


const styles: { [key: string]: any } = {
    generalCard: {
        boxShadow: "none",
        paddingRight: 8,
        paddingLeft: 8
    },
    navButtons: {
        backgroundColor: 'transparent',
        color: "black"
    }
};