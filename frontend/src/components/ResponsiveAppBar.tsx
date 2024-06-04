import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Badge,
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import {  useEffect, useState } from "react";
import React from "react";
import { Settings, Logout, ExpandLess, ExpandMore, Language } from "@mui/icons-material";
import TelegramIcon from '@mui/icons-material/Telegram';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WalletIcon from '@mui/icons-material/Wallet';
import { useTranslation } from "react-i18next";

import { GetUsrInfoResponse } from "../models/User";
import { UserService } from "../services/UserService";



const userService = new UserService();


const ResponsiveAppBar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({} as GetUsrInfoResponse);
  const [openLanguages, setOpenLanguages] = useState(false);


  useEffect(() => {
    if (auth?.isLoggedIn) {
      setIsLoggedIn(true);

      userService.get()
        .then((response: GetUsrInfoResponse) => {
          setUserDetails(response)})
        
    }
  }, [auth]);



  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };



  const [appBarMenuAnchor, setAppBarMenuAnchor] = React.useState<null | HTMLElement>(null);
  const open = Boolean(appBarMenuAnchor);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppBarMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAppBarMenuAnchor(null);
  };

  const [openSettings, setOpenSettings] = React.useState(false);

  const handleLogOut = () => {
    userService.logout();
  };



  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleClickLanguages = () => {
    setOpenLanguages(!openLanguages);
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl" style={styles.container}>
        <Toolbar disableGutters style={styles.toolbar}>
          <div style={styles.homeBtn} onClick={() => navigate("/")}>
            <CurrencyExchangeIcon />
            <Typography variant="h6" noWrap component="div" style={styles.typography}>
             &nbsp; Finansea
            </Typography>
          </div>
          {isLoggedIn && (
            <React.Fragment>
              <Box sx={styles.appBarBox}>
                <Tooltip title="App Bar">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={styles.iconButtonStyle}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >

                     <Badge variant="dot" invisible={0 === 0} color="warning" sx={{ marginRight: 1 }}>
                      <AccountCircleIcon />
                    </Badge>
                    {userDetails.name} 
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={appBarMenuAnchor}
                id="account-menu"
                open={open}
                onClose={() => {
                  handleClose();
                  handleCloseSettings();
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                 
                    <ListItemButton  onClick={() => {
                      handleClose();
                      handleCloseSettings();
                      navigate('/accounts')
                    }}>
                      <ListItemIcon sx={styles.settingsIcons}>
                        <WalletIcon />
                      </ListItemIcon>
                      <ListItemText primary={t('accounts')} />
                    </ListItemButton>
                <ListItemButton onClick={handleClickLanguages}>
                  <ListItemIcon sx={styles.settingsIcons}>
                    <Language fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={t('language')} />
                  {openLanguages ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openLanguages} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton onClick={() => {
                      changeLanguage('ro')
                    }}>
                      <ListItemText primary="Ro" />
                    </ListItemButton>
                    <ListItemButton onClick={() => {
                      changeLanguage('en')
                    }}>
                      <ListItemText primary="En" />
                    </ListItemButton>
                  </List>
                </Collapse> 
                <ListItemButton  onClick={() => {
                      handleClose();
                      handleCloseSettings();
                      navigate('/otp')
                    }}>
                      <ListItemIcon sx={styles.settingsIcons}>
                        <TelegramIcon />
                      </ListItemIcon>
                      <ListItemText primary={t('Connect Telegram')} />
                    </ListItemButton>

                <MenuItem onClick={() => {
                  handleClose();
                  handleCloseSettings();
                }}>
                  <ListItemIcon  onClick={() => {
                    handleClose();
                    handleCloseSettings();
                    handleLogOut();
                  }} >
                    <Logout fontSize="small" />
                  </ListItemIcon >
                  {t('log_out')}
                </MenuItem>
            


              </Menu>
            </React.Fragment>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const styles: { [key: string]: any } = {
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  homeBtn: {
    display: "flex",
    cursor: "pointer",
  },
  typography: {
    color: "white",
  },
  container: {
    margin: 0,
  },
  appBarBox: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center'
  },
  menuPaper: {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      width: "165px",
      mt: 1.5,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  },
  settingsIcons: {
    minWidth: "36px"
  },
  iconButtonStyle: {
    color: "white",
    borderRadius: "5px"
  },
};

export default ResponsiveAppBar;