import { useState, useEffect } from "react";
import api from "../services/api";
import LocalStorageManager from "../hooks/useLocalStorage.js";
import { verifyUser } from "../services/auth.api.js";
import { useParams } from "react-router-dom";
import toast  from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CircleCheck , Circle } from 'lucide-react';
import { capitalize } from "lodash";
// http://127.0.0.1:8000/order/50/




const ProductsList = ({items})=>{
    const navigate = useNavigate()

    
return <div className=" p-2 flex items-center justify-between px-8 cursor-pointer" onClick={()=>{navigate(`/product/${items.product.slug}`)}}>
        <div className="img">
        <img src={items.product.images[0].image_url} alt="img" className='object-cover h-8 sm:h-10 md:h-30' />
       </div>
       <div className="name text-xs mx-3 px-2 md:text-lg w-150">
            <p className="font-bold text-gray-700">{items.product.title}</p>
       </div>
        <div className="detail flex flex-col font-semibold text-xs md:text-lg">
            <span>Quantity: {items.quantity} </span>
            <span>Price: {(items.unit_price * items.quantity).toFixed(2)}</span>
        </div>
</div>

}








const OrderHistoryDetailsPage = () => {
    const tokens = new LocalStorageManager("tokens");
    const params = useParams();     
    const [verification , setVerification] = useState(null)  
    const [details, setDetails] = useState(null) 
    const [status, setStatus] = useState(null)
    const [date , setDate] = useState()
    const errorNotify = (message) => toast.error(message,{id:"success-order-details"});
    const sucessNotify = (message) => toast.success(message,{id:"error-order-details"});
   

    const comma = (dateStr)=>{
                    
                dateStr.split(" ")
                const split = dateStr.substring(4).split(" ").join(",")
                    
                    return split

                }

    const fetchOrderDetails = async () => {
    const access = tokens.get().access;
    setVerification(await verifyUser());

    try {
        let response = await api.get(`/order/${params.id}/`,{
            headers:{
                "Authorization":`Bearer ${access}`
            }
        })
        
        if(response.status == 200){
        
            setStatus(response.data.status)
            setDetails(response.data)   

            const dateString =response.data.created_at;   
            const dateFromString = new Date(dateString);

            setDate(comma(dateFromString.toDateString()))
            // dateStr.toDateString().substring(4).split(" ").join(",")

            return sucessNotify("Fetched Order details Successfully")
        }
        
        return errorNotify("No order details Found")

    } catch (error) {

        return errorNotify("Unauthorised access")


    }
  };


  useEffect(() => {
    fetchOrderDetails()

      
  }, [])
  

   
    function statusColor(status){
      if (['placed', 'Placed'].includes(status)) {

        return {"color":"gray"}
      }else if (['processing','Processing'].includes(status)) {

        return {"color":"orangered"}
      }else if (['shipped','Shipped'].includes(status)) {

        return {"color":"orange"}
      }else if (['delivered','Delivered'].includes(status)) {

        return {"color":"#00c900"}
      }else if (['cancelled','Cancelled'].includes(status)) {

        return {"color":"red"}
      }else{

        return {"color":"#00000000"}
      }
      
    }





  return verification !== null && verification.valid && details !== null ?
  <div className=" cursor-default">
    <div className="productsList">
        {
            details.items.map((ele,idx)=>{
                
                return <div key={idx} className=" shadow  m-2 p-3">
                    <ProductsList items={ele} />
                   
                </div>
            })
        }
         <span className="px-5 font-bold text-gray-500 flex">
           Order ID:  <p className="ml-2"> #{details.reference_id } </p>
        </span>
    </div>

    <div className="deliveryStatus border p-5 m-9 rounded-xl md:rounded-2xl shadow-xl" style={statusColor(status)}>

        <div className="flex justify-between">
            <span>
            Delivery, {date}
            </span>    
            <span>
                {
                ['delivered','Delivered'].includes(status) && status !== null ?
                 <p>
                    {capitalize(status)}
                 </p>
                :
                 <p>
                    {capitalize(status)} by {date}
                </p>
                
                }
              
            </span>

        </div>

        <div className="">
            {
                ['delivered','Delivered'].includes(status) && status !== null?
                <div className="flex items-center">
                     <CircleCheck />
                        <div className="mx-2 border w-full h-0 " ></div>
                     
                <CircleCheck />

                </div>
                :
                <div>
                    {
                        ['placed', 'Placed'].includes(status)?
                       <div className="flex items-center">
                       
                        <Circle />  
                        <div className="mx-2 border w-full h-0 " ></div>
                        <Circle />      
                     
                       </div>
                        :
                        <div className="flex items-center">
                        <CircleCheck />  
                        <div className="mx-2 border w-full h-0 " ></div>
                        <Circle />
                        </div>
                    }
                </div>
            }
           
        </div>



    </div>

    <div className="reviewsAndRating">
        
    </div>

  </div>
  :
  <div className="text-2xl font-bold flex justify-center items-center h-screen">
    No Order Details Found
  </div> 
};

export default OrderHistoryDetailsPage;
