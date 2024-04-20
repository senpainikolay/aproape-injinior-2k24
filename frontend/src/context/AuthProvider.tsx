import { createContext, useState, ReactNode } from "react";

import { AUTH_ACCESS_TOKEN } from "../services/AuthorizedApi";
export interface IAuthState {
  isLoggedIn: boolean,
}
export interface AuthContextType {
  auth: IAuthState | null;
  setAuth: (authState: IAuthState) => void;
}

export const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  let authToken = window.localStorage.getItem(AUTH_ACCESS_TOKEN);
  const [auth, setAuth] = useState<IAuthState>({ isLoggedIn: Boolean(authToken) });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;