import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import {useTranslation} from "react-i18next";


export const AlreadyLoggedIn = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate('/');
        }, 5000);
        return () => clearTimeout(timeout);
    }, [navigate]);
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            <Typography variant="h5" gutterBottom>
                {t('already_logged_in')}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 3 }}>
                {t('redirect')}
            </Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>
                {t('go_to_homepage')}
            </Button>
        </Box>
    );
}
