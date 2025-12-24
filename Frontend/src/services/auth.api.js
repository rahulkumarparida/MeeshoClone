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




export const verifyUser = (data) => {
  let { access, refresh } = data;


  try {
    api.post("/users/token/verify/", {"token": access});
    
    return { valid: true }
  } catch (error) {

      try {
        
        let resp = api.post("/users/token/refresh/", { "refresh": refresh});

        let tokens = JSON.parse(localStorage.getItem("tokens"))
        access = resp.data.access
        load = JSON.stringify({
            "access":access,
            "refresh":tokens.refresh
        })
        localStorage.setItem("tokens" , load)
        api.post("/token/verify/", payload)

        return  { valid: true }

      } catch (error) {
        localStorage.removeItem("tokens")
        return { valid: false, reason: "Session expired",}

      }
  }
};
