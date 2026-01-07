import { useState , useEffect } from "react"
import api from "../services/api.js"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import { verifyUser } from "../services/auth.api.js"
import Headers from "../components/Headers.jsx"
import CartProductCard from "../components/elements/CartProductCard.jsx"
import { reverse } from "lodash"
import toast , {Toaster} from "react-hot-toast"

const CartPage = () => {
    const [cartProducts , setCartProducts] = useState(null)
    const [verifyUserValue , setVerifyUserValue] = useState(null)
    const [Total, setTotal] = useState(0)
    const tokens = new LocalStorageManager("tokens")
    
    const fetchCartProduct = async () => {
        setVerifyUserValue(await verifyUser(tokens.get()))
        const access = tokens.get().access

        try {

            const response = await api.get("cart/",{
                headers:{
                    "Authorization":`Bearer ${access}`
                }
            })
            
            // console.log(response.data.items);
            const products = reverse(response.data.items)
            products.map((ele)=>{
                setTotal(prev => prev+(ele.quantity*ele.unit_price))
            })
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
        <div className="Total fixed bottom-0 w-full bg-white h-30 border-t flex justify-end items-center font-bold text-gray-600 text-xl">
            <div className="totalProducts mx-30">
                Total Products : 
            </div>
            <div className="total mx-30 mr-40">
                Total Price :  ₹{Total}
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