import { useState , useEffect} from "react"
import api from "../services/api.js"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import { verifyUser } from "../services/auth.api.js"
import FormProductDetails from "../components/FormProductDetails.jsx"


const SellerAddProductPage = () => {
  const [verifiication, setVerifiication] = useState(null)
  const tokens = new LocalStorageManager("tokens")


useEffect(() => {
  
  const access = tokens.get().access
  return async () => {
    const response =await api.get("/users/role/",{
      headers:{
        "Authorization":`Bearer ${access}`
      }
    })
    
    if ((response).status == 200) {
      
      setVerifiication(await verifyUser())
    }
 
  }
}, [])



  return verifiication !== null && verifiication.valid?
  (
        <div className="">
          <div className="head text-3xl font-bold text-gray-700 p-4">
            Add Products
          </div>
          <div className="formhere w-screen  h-screen flex items-center justify-center">

              <FormProductDetails Authtokens={tokens} />
              
          </div>
        
        </div>
  )
  :
 <div className="h-screen w-screen text-xl md:text-3xl text-gray-600 font-bold flex justify-center items-center">
    You are not authorizrd to accesss this page
  </div>
}

export default SellerAddProductPage