import { verifyUser } from "../services/auth.api"
import api from "../services/api"
import LocalStorageManager from "../hooks/useLocalStorage"




const SellerDashboardPage = () => {
    const tokens = new LocalStorageManager('tokens')

    const fetchSales = async () => {
            



    }



  return (
    <div>
        SellerDashboardPage
    </div>
  )
}

export default SellerDashboardPage