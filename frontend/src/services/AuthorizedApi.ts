import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "./baseApi";



export const AUTH_ACCESS_TOKEN  = "AUTH_ACCESS_TOKEN";
export const AUTH_REFRESH_TOKEN  = "AUTH_REFRESH_TOKEN";




class AuthorizedApi {
  getInstance = async (): Promise<AxiosInstance> => {
  const axiosInstance = axios.create({ baseURL: BASE_URL });
  let authToken = window.localStorage.getItem(AUTH_ACCESS_TOKEN);
  axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  axiosInstance.interceptors.request.use(function (config: any) {
    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        window.localStorage.removeItem(AUTH_ACCESS_TOKEN);
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
}

export default AuthorizedApi;

  