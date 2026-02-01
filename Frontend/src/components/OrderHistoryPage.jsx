import { useState , useEffect } from "react"
import api from "../services/api.js"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import { verifyUser } from "../services/auth.api.js"
import Headers from "../components/Headers.jsx"
import OrderHistoryCard from "./elements/OrderHistoryCard.jsx"
import toast from "react-hot-toast"


const OrderHistoryPage = () => {

const tokens = new LocalStorageManager("tokens")    
const [verification , setVerification] = useState(null)   
const [orderHistory ,setOrderHistory] = useState(null)



// http://127.0.0.1:8000/order/history/

const fetchOrderHistory = async () => {
    const access = tokens.get().access
    setVerification(await verifyUser())
    try {

        let response = await api.get("/order/history/",{
            headers:{
                "Authorization":`Bearer ${access}`
            }
        })

        setOrderHistory(response.data)

        
    } catch (error) {
       toast.error("Error while fetching order history");
        
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
        <div className="p-5">
            {
                orderHistory !== null && verification.valid ?
                orderHistory.length>0 ? orderHistory.map((ele,idx)=>{
                    return <div key={idx} >
                        <OrderHistoryCard ele={ele}  />
                    </div>
                }):
                <div className="h-screen  text-xl md:text-3xl text-gray-600 font-bold flex justify-center items-center">
                    No History
                </div>
                :
                <div className="h-screen text-xl md:text-3xl text-gray-600 font-bold flex justify-center items-center">
                   <div className="loadings"></div>
                </div>
            }
            
        </div>
    </div>
  )
}

export default OrderHistoryPage