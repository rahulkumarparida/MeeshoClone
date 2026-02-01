import api from "./api";
import LocalStorageManager from "../hooks/useLocalStorage";

export const loginUser = (data) => {
  req = {
    email: data.email,
    password: data.password,
  };
  api.post("/users/login/", req,{
      headers: {
        'Content-Type': 'application/json'
      }
      
    });
};

export const registerUser = (data) => {
  api.post("/users/register/", data,{
      headers: {
        'Content-Type': 'application/json'
      }
      
    });
};




export const verifyUser = async () => {
  const data = new LocalStorageManager('tokens')
  const  access = data.get().access;
  const refresh = data.get().refresh;

  try {
    // First verify the access token
    let res = await api.post("/users/token/verify/", JSON.stringify({ "token": access }),{
      headers: {
        'Content-Type': 'application/json'
      }
      
    });
    

    if (res.statusText !== 'OK') {
      // If access token is invalid, try to refresh
      return await refreshAccessToken(refresh);
    }
    return { valid: true };
    
  } catch (error) {
    // If verification failed, try to refresh the token
    
    return await refreshAccessToken(refresh);
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    let resp = await api.post("/users/token/refresh/", { "refresh": refreshToken },{
      headers: {
        'Content-Type': 'application/json'
      }
      
    });
  
    
    if (resp.status === 200 && resp.data.access) {
      
      // Update localStorage with new tokens
      let tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      tokens.access = resp.data.access;
      
      // If backend returns a new refresh token, update it too
      if (resp.data.refresh) {
        tokens.refresh = resp.data.refresh;
      }
      
      localStorage.setItem("tokens", JSON.stringify(tokens));
      
      // Verify the new access token
      try {
        let verification = await api.post("/users/token/verify/", { 
          "token": resp.data.access 
        },{
      headers: {
        'Content-Type': 'application/json'
      }
      
    });
        
        if (verification.status === 200) {
          return { valid: true, newTokens: true };
        }
      } catch (verifyError) {
        return { valid: false, reason: "New token verification failed" };
      }
    }
    
    return { valid: false, reason: "Refresh failed" };
    
  } catch (error) {
    
    // Clear tokens on refresh failure
    localStorage.removeItem("tokens");
    
    if (error.response?.status === 401) {
      return { valid: false, reason: "Session expired. Please login again." };
    }
    
    return { valid: false, reason: "Server error during token refresh" };
  }
};
