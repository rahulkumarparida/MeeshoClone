import api from "./api";

export const loginUser = (data) => {
  req = {
    email: data.email,
    password: data.password,
  };
  api.post("/users/login/", req);
};

export const registerUser = (data) => {
  api.post("/users/register/", data);
};




export const verifyUser = async (data) => {
  let { access, refresh } = data;

  try {
    // First verify the access token
    let res = await api.post("/users/token/verify/", { "token": access });

    

    if (res.status === 200) {
      return { valid: true };
    } else {
      // If access token is invalid, try to refresh
      return await refreshAccessToken(refresh);
    }
    
  } catch (error) {
    // If verification failed, try to refresh the token
    console.log("Access token expired or invalid, trying to refresh...");
    return await refreshAccessToken(refresh);
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    let resp = await api.post("/users/token/refresh/", { "refresh": refreshToken });
  
    
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
        });
        
        if (verification.status === 200) {
          return { valid: true, newTokens: true };
        }
      } catch (verifyError) {
        console.error("New token verification failed:", verifyError);
        return { valid: false, reason: "New token verification failed" };
      }
    }
    
    return { valid: false, reason: "Refresh failed" };
    
  } catch (error) {
    console.error("Token refresh error:", error);
    
    // Clear tokens on refresh failure
    localStorage.removeItem("tokens");
    
    if (error.response?.status === 401) {
      return { valid: false, reason: "Session expired. Please login again." };
    }
    
    return { valid: false, reason: "Server error during token refresh" };
  }
};
