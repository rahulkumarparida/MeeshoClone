import { verifyUser } from "../services/auth.api"
import api from "../services/api"
import LocalStorageManager from "../hooks/useLocalStorage"
import { useState , useEffect } from "react"
import meeshoLogo from "../assets/meeshoLogo.png"
import { Link , useNavigate } from "react-router-dom"
import ProductEnlistedCard from "./elements/ProductEnlistedCard"
import { VerifiedIcon } from "lucide-react"
import Headers from "./Headers"


const ProductEnlnistedPage = () => {
    const tokens = new LocalStorageManager('tokens')
    const [verification, setVerification] = useState(null)
    const [ products , setProducts ] = useState(null)
    const navigate = useNavigate()


    const fetchEnlistedProducts = async () => {
        setVerification(await verifyUser())
        const access = tokens.get().access 

        try {

            const response = await api.get("/seller/products/",{
                headers:{
                    "Authorization":`Bearer ${access}`
                }
            })

            console.log(response);
            setProducts(response.data)
            
            
        } catch (error) {

            console.error("Error while fetching enlisted products", error);
            
            
        }
        
    }



    useEffect(() => {
      
        fetchEnlistedProducts()

    }, [])
    




  return verification !== null && verification.valid ?(
    <div>
        <div className="head">
           <Headers/>
        </div>
        <div className="subhead p-8  flex items-center justify-between">
            <span className="text-gray-600 font-bold text-xl md:text-3xl ">
                Products enlisted till now
            </span>
            <span className="m-2 px-4 hover:border border-pink-800 hover:bg-pink-600 hover:text-white font-semibold  p-2 rounded shadow-xl cursor-pointer transition duration-150 " onClick={()=>{navigate("/seller/products/add/")}}>
                Add Product
            </span>
        </div>
        <div className="productcard">
            {
                products !== null?
                <div>
                    {
                        products.map((ele,idx)=>{
                            return  <ProductEnlistedCard items={ele} key={ele.id} /> 

                        })
                    }
                </div>
                :
                <div className="h-screen w-screen text-xl md:text-3xl text-gray-600 font-bold flex justify-center items-center">
                    No Products Enlisted yet
                 </div>
            }
            
        </div>

    </div>
  )
  :
  <div className="h-screen w-screen text-xl md:text-3xl text-gray-600 font-bold flex justify-center items-center"
  >
    {
        <div className="loadings"></div>
     
    }
  </div>
}

export default ProductEnlnistedPage