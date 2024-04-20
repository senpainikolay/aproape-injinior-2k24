import {useNavigate} from 'react-router-dom';
import SignInForm from "../components/Auth/SignInForm";
import useAuth from '../hooks/useAuth';
import {useTranslation} from "react-i18next";

export const SignInPage = () => {
    const navigate = useNavigate();
    const {setAuth} = useAuth();
    const {t} = useTranslation();

    return (
        <div>
            <SignInForm submitCallback={() => {
                setAuth({isLoggedIn: true});
                navigate("/");
            }} message={t('sign_in')}/>
        </div>
    );
} 
