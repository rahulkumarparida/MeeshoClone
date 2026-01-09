import { useState , useEffect } from "react"
import api from "../services/api.js"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import { verifyUser } from "../services/auth.api.js"
import Headers from "../components/Headers.jsx"
import CartProductCard from "../components/elements/CartProductCard.jsx"
import { reverse } from "lodash"
import toast , {Toaster} from "react-hot-toast"
import { useNavigate } from "react-router-dom"
const CartPage = () => {
    const [cartProducts , setCartProducts] = useState(null)
    const [verifyUserValue , setVerifyUserValue] = useState(null)
    const [Total, setTotal] = useState(0)
    const tokens = new LocalStorageManager("tokens")
    const navigate = useNavigate()

    const fetchCartProduct = async () => {
        setVerifyUserValue(await verifyUser(tokens.get()))
        const access = tokens.get().access

        try {

            const response = await api.get("cart/",{
                headers:{
                    "Authorization":`Bearer ${access}`
                }
            })
            
            console.log(response);
            const products = response.data.items
           setTotal(response.data.total)
            setCartProducts(products)
        } catch (error) {
            
        }
   
    }


    useEffect(() => {
      fetchCartProduct()
        
    }, [])
    




  return verifyUserValue!==null&& verifyUserValue.valid == true && cartProducts !== null ?
  (
    <div>
        <Toaster toasterId="productCart" position="top-right" reverseOrder={false} />
        <div className="head">
            <Headers/>
        </div>
        <div className="cartProducts p-30 flex flex-col items-center">
            {
                cartProducts.map((ele,idx)=>{

                    return <CartProductCard ele={ele} key={ele.id} />
                })
            }
        </div>
        <div className="Total fixed bottom-0 w-full bg-white h-30 border-t flex justify-evenly items-center font-bold text-gray-600 text-xl">
            <div className="totalProducts ">
                Total Products : {cartProducts.length}
            </div>
            <div className="total mx-30 ">
                Total Price :  ₹{Total}
            </div>
            <div className="buyNOw text-white bg-pink-500 px-3 py-1 rounded  cursor-pointer "
            onClick={()=>{navigate("/order")}}
            >
                Buy Now
            </div>
        </div>
    </div>
  )
  :
  (
    <div>
        <div className="head">
            <Headers/>
        </div>
        <div className="cartProducts flex items-center justify-center font-bold text-gray-500 text-xl md:text-4xl h-screen">
            No product added to the cart
        </div>
    </div>
  )
}

export default CartPage