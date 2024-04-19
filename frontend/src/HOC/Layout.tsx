import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "../Assets/Theme/theme";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import { ReactNode } from "react";

interface ILayoutProps {
    children: ReactNode;
}

export const Layout = (props: ILayoutProps) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ResponsiveAppBar/>
            <main>{props.children}</main>
        </ThemeProvider>
    );
}