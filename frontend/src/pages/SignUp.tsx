import SignUpForm from "../components/Auth/SignUpForm";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const SignUpPage = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <div>
            <SignUpForm message={t('sign_up')} submitCallback={() => {
               navigate("/signin");
            }}/>
        </div>
    );
};
