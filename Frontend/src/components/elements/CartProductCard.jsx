import api from "../../services/api.js";
import LocalStorageManager from "../../hooks/useLocalStorage.js"
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus , Minus } from "lucide-react";


const CartProductCard = ({ele}) => {
    const [quantityCount, SetQuantityCount] = useState(ele.quantity)
    const navigate = useNavigate()
  
    

const goToProduct = (slug)=>{
    
    navigate(`/${slug}`)
}

// http://127.0.0.1:8000/cart/update/42/ -- patch


const updateCartProduct = async (cartItemId , qty)=> {
    
    const tokens = new LocalStorageManager("tokens")
    const access = tokens.get().access
    console.log(cartItemId , qty);
    
   setTimeout(async () => {
         try {
        const req = {
            "quantity": qty
        }

        const response = await api.patch(`cart/update/${cartItemId}/` , req , {
            headers :{
                "Authorization":`Bearer ${access}`
            }
        })

        console.log(response);
        if (response.statusText == "OK") {
            
        }

    } catch (error) {

        console.error("Error: while adding to cart" , error)
    }
    
    
   }, 200);
}


const removeCartItem = async () => {
  const tokens = new LocalStorageManager("tokens")
  const access = tokens.get().access
  
  const item = ele.id
  try{
    let response = await api.delete(`/cart/remove/${item}/`,{
      headers:{
        "Authorization":`Bearer ${access}`
      }
    })
    if(response.status == 204){
      location.reload()
    }
    console.log(response);
    
  }catch(error){
    console.error("Error while removing cart item.")
  }
}





    
  return (
    <div className='h-50 w-fit md:w-160 lg:w-250 flex items-center  border-2 border-gray-200 shadow hover:border-3 hover:border-pink-400 hover:shadow-xl rounded-2xl transition duration-150 m-4 p-7 overflow-hidden cursor-pointer'
    
    >
  
        <div className="image" onClick={()=>{goToProduct(ele.product.slug)}}>
            {
                <img src={ele.product.images[0].image_url} alt="Product Image" className='h-15 object-cover md:h-30 ' loading='lazy' />
            }
        </div>

        <div className="details p-5  " onClick={()=>{goToProduct(ele.product.slug)}}>
            <span className='font-bold text-gray-700 text-xs md:text-2xl' title={ele.product.title}>
                {ele.product.title.slice(0,50)+"..."}
            </span>
            <br />
            <span className='font-semibold text-gray-500 hidden md:block' title={ele.product.description}>
                {ele.product.description.slice(0,100)}
            </span>
        </div>

        <div className="subtotal  font-semibold text-xs md:text-lg p-2">
   
              <div className="qunatity border p-2 border-gray-200 flex  mt-2 mx-7  ">
                
                <div
                  onClick={() => {
                    quantityCount > 1
                      ? SetQuantityCount((prev) => prev - 1)
                      : SetQuantityCount(1);
                     quantityCount > 1? updateCartProduct(ele.id ,quantityCount-1):updateCartProduct(ele.id ,quantityCount)
                  }}
                >
                  <Minus className=" rounded-[50%] mx-2 h-7 w-7 shadow text-pink-500 hover:text-pink-700 hover:shadow-3xl border-2 border-pink-200" />
                </div>

                <span className="text-xl text-pink-600">{quantityCount}</span>
                <div
                  onClick={() => {
                    SetQuantityCount((prev) => prev + 1);
                    updateCartProduct(ele.id ,quantityCount+1)
                  }}
                >
                  <Plus className=" rounded-[50%] mx-2 h-7 w-7 shadow text-pink-500 hover:text-pink-700 hover:shadow-3xl border-2 border-pink-200" />
                </div>
              </div>

           <div></div>
           <div className="text-gray-800 text-center mt-4 w-full border border-gray-200">
             ₹{ele.unit_price * ele.quantity}
           </div>
           <div></div>
           <div className="remove text-center  p-1 m-3 border-2 rounded-sm border-gray-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition duration-75" onClick={removeCartItem}>
            Remove
           </div>
        </div>
    </div>
  )
}

export default CartProductCard