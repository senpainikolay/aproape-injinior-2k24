import axios, { AxiosInstance } from "axios";
import { BASE_URL, ACCESS_TOKEN } from "./baseApi";



class AuthorizedApi {
      getInstance = async(): Promise<AxiosInstance> => {
      const axiosInstance = axios.create({ baseURL: BASE_URL });
      axiosInstance.defaults.headers.common['X-Access-Token'] = `${ACCESS_TOKEN}`;   
      return axiosInstance;
    };
  }
  export default AuthorizedApi;
  