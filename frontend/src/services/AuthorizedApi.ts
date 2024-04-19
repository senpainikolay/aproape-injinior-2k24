import axios, { AxiosInstance } from "axios";
import { BASE_URL, ACCESS_TOKEN } from "./baseApi";



export default class AuthorizedApi {
      getInstance = async(): Promise<AxiosInstance> => {
      const axiosInstance = axios.create({ baseURL: BASE_URL });
      return axiosInstance;
    };
  }


  