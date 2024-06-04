

export interface RegisterReq{
    email: string;
    name: string;
    password: string;
}

export interface User{
  id: string;
  first_name: string;
  last_name: string;
  
}

interface Tokens  {
    access: string;
    refresh: string;
  };
  

 export interface AccessTokenResponse  { 
  access: string; 
}
  
export interface LoginResponse {
      message: string;
      tokens: Tokens;
  }

  export interface LoginReq {
    email: string;
    password: string;
}
  
  export interface GetUsrInfoResponse {
    id: string;
    name: string;
  }

  export interface OTPReq { 
    tg_usrname: string;
  }

  export interface OTPRes { 
    otp: string;
  }
  
  
  