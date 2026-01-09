import { useState , useEffect } from "react"
import api from "../services/api.js"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import { verifyUser } from "../services/auth.api.js"
import Headers from "../components/Headers.jsx"


const OrderHistoryPage = () => {

const tokens = new LocalStorageManager("tokens")    
const [orderHistory ,setOrderHistory] = useState(null)
// http://127.0.0.1:8000/order/history/

const fetchOrderHistory = async () => {
    const access = tokens.get().access
    try {

        let response = await api.get("/order/history/",{
            headers:{
                "Authorization":`Bearer ${access}`
            }
        })

        console.log(response)
        setOrderHistory(response.data)

        
    } catch (error) {
       console.error("Error while fetching order history");
        
    }
    
}

useEffect(() => {
  
    fetchOrderHistory()
  
}, [])



  return (
    <div>
        <div className="headers">
            <Headers/>
        </div>
        <div>
            
        </div>
    </div>
  )
}

export default OrderHistoryPage