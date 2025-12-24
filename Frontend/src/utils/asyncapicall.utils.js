import api from "../services/api";

import LocalStorageManager from "../hooks/useLocalStorage";
const tokenStore =new LocalStorageManager("tokens")


class AsyncApiCall {

    static getAuthHeader(){
        const tokens = tokenStore.get()
        return tokens?.access ? {"Authorization":`Bearer ${access}`}:{}
    }
    
    static async get(path) {
        try {
            let response =await api.get(path ,{ headers:this.getAuthHeader()})   

            return  response.data
        } catch (error) {
            return {
                valid:false,
                reason: error.response?.data || error.message,
            }
        }
    }


    static async post(path , data){
        try {
            let response =await api.post(path , data ,{ headers:this.getAuthHeader()})

            return response.data
        } catch (error) {
            return {
                valid:false,
                reason: error.response?.data || error.message,
            }
        }
    }

}

export default AsyncApiCall