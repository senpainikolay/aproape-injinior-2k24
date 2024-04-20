import axios  from "axios";
import {
  LoginReq,
  LoginResponse,
  RegisterReq,
  GetNameResponse,
} from "../models/User";
import AuthorizedApi, { AUTH_ACCESS_TOKEN, AUTH_REFRESH_TOKEN } from "./AuthorizedApi"; 

import {BASE_URL} from './baseApi' 




export class UserService extends AuthorizedApi {

  public get = async (): Promise<GetNameResponse> => {
    let instance = await this.getInstance();
    return instance
      .get(`auth/me`)
      .then((response) => {
        return response.data as GetNameResponse;
      })
      .catch((error) => {
        console.error(error);
        return Promise.reject(error);
      });
  };


  public register = async  (user: RegisterReq) : Promise<void> => {
    return axios
    .post(BASE_URL + "auth/register", user)
  }


  public login = async (loginRequest: LoginReq): Promise<void> => {
   
    return axios
      .post( BASE_URL +  "auth/login", loginRequest)
      .then( response => {
        const d = response.data as LoginResponse
        window.localStorage.setItem(AUTH_ACCESS_TOKEN, d.tokens.access);
        window.localStorage.setItem(AUTH_REFRESH_TOKEN, d.tokens.refresh);
      })
  };

  
  // public logout = async (): Promise<void> => {
  //   return axios.post(BASE_URL + "Users/logout").then(() => {
  //     window.localStorage.removeItem(AUTH_TOKEN)
  //   })
  // }
}