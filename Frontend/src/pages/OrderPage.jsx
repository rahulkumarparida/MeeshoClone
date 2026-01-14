import { useState , useEffect } from "react"
import api from "../services/api.js"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import { verifyUser } from "../services/auth.api.js"
import Headers from "../components/Headers.jsx"
import CartProductCard from "../components/elements/CartProductCard.jsx"
import toast  from "react-hot-toast"
import { Pencil } from "lucide-react"
import meeshoLogo from "../assets/meeshoLogo.png"
import loader from "../assets/loader.gif"
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


const OrderPage = () => {
  const tokens = new LocalStorageManager("tokens") 
  const [cartProducts , setCartProducts] = useState(null)
  const [verifyUserValue , setVerifyUserValue] = useState(null)
  const [order ,setNewOrder] = useState(null)
  const [userData , setUserData]= useState(null)
  const [loading,setLoading] = useState(false)
  const { error, isLoading, Razorpay } = useRazorpay(); 

  // Order from the Cart
   const fetchCartProduct = async () => {
        setVerifyUserValue(await verifyUser())
        const access = tokens.get().access

        try {

            const response = await api.get("cart/",{
                headers:{
                    "Authorization":`Bearer ${access}`
                }
            })
            
            console.log(response);
            const products = response.data
            setCartProducts(products)
        } catch (error) {
            console.error("Error while fecthing this data");
            
        }
   
    }
useEffect(() => {
 fetchCartProduct()
}, [])



const handleOrder = async (e) => {
  const access = tokens.get().access

    // order/place/
    try {
      let userReponse = await api.get("/users/me/" , {
                headers:{
                    "Authorization":`Bearer ${access}`
                }
            })
      
          setUserData(userData)

      console.log(access);
            
      let orderResponse = await api.post("/order/place/",
        {}
        ,{
        headers:{
          "Authorization":`Bearer  ${access}`
        }
      })
      console.log(orderResponse);
      
      setNewOrder(orderResponse.data)

      const  options = {
          "key": orderResponse.data.razorpay_key_id, // Razorpay Key ID from backend
          "amount": orderResponse.data.total, // Amount in paise (subunits)
          "currency": "INR",
          "name": "Meesho Clone API",
          "description": "Meesho Clone API is an E-commerce API designed and built with Meesho as reference.",
          "image": "https://example.com/your_logo",
          "order_id": orderResponse.data.reference_id, // Order ID created from backend
          "callback_url": orderResponse.data.razorpay_callback_url,

          "prefill": {
              "name": userReponse.data.first_name + " " + userReponse.data.last_name,
              "email": userReponse.data.email,
              "contact": userReponse.data.profile.phone
          },

          "notes": {
              "address": "Razorpay Corporate Office"
          },

          "theme": {
              "color": "#3399cc"
          }
};

      var rzp1 = new Razorpay(options);

      rzp1.open();
      
      
    } catch (error) {
      console.error("Error while handling Order Payment", error);
      if (error.response.status == 406) {
       return toast.error("Maximum quantity 5") 
      }
    }
    
    
    e.preventDefault(); 

}



  return verifyUserValue!==null&& verifyUserValue.valid == true && cartProducts !== null? (
    <div>
      <div className="header">
        <Headers />
      </div>
      <div className="addresssTop border mt-5 h-30  flex items-center justify-start px-5 " >
      <span className="p-4 text-3xl font-semibold text-gray-600">Address: </span>
      <span className="p-2 text-2xl font-semibold text-gray-800">
        Bhadrasahi xyz , yznxxw ,awdsb
      </span>
      <span className="text-gray-700 cursor-pointer">
        <Pencil/>
      </span>
      </div>
      <div className="products overflow-y-scroll hide-scrollbar">
        {
                cartProducts.items.map((ele,idx)=>{

                    return <CartProductCard ele={ele} key={ele.id} />
                })
                }
      </div>
      <hr className="m-6 border-3 text-gray-400" /> 
     {
      loading ?
      
      <div className="text-center flex items-center justify-center">

        <img src={loader} className="h-13"></img>
        {isLoading && <p>Loading Razorpay...</p>}
        {error && <p>Error loading Razorpay: {error}</p>}

      </div>
      : 
      <div className="flex justify-end px-20">
          <span className="text-xl mx-1 font-semibold py-1">Total : </span>
          <span className="text-xl mx-1 font-semibold py-1">
            ₹{cartProducts.total}
            </span>
            <span className="px-4 py-1 cursor-pointer ml-10 text-white rounded-sm bg-pink-500 text-center mx-1 font-semibold"
            onClick={(e)=>{handleOrder(e)}}
            >
          Confirm Order
        </span>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </div>
     }
      <hr className="m-6 border-3 text-gray-400" />   
  
    </div>
  ):
  "No Products Added"
            
}

export default OrderPage