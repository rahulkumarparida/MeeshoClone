import api from "./api";


export const loginUser = (data)=>{
    req = {
        "email": data.email,
        "password":data.password
    }
    api.post('/users/login/' , req)
}

export const registerUser = (data)=>{
    api.post('/users/register/' , data)
}
