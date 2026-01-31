import { useParams , useNavigate } from "react-router-dom"
import { useState , useEffect } from "react"
import api from "../services/api"
import LocalStorageManager from "../hooks/useLocalStorage"
import { verifyUser } from "../services/auth.api.js"
import toast from "react-hot-toast"

const SellerProductDetails = () => {
    const formatDate = (date) =>
        date
        ? new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            })
        : "-";




    const Reviewcard = ({data})=>{

        return <div className="flex flex-col  border m-3 p-3 rounded border-gray-200 shadow hover:border-pink-400 hover:bg-pink-100 transition duration-150">
            <span className="p-2 max-w-fit   ">
                Rated : {data.rating}
            </span> <br />
            <span className="p-2 max-w-fit   ">
                {data.comment}
            </span> <br />
            <span className="p-2 max-w-fit   ">
                {formatDate(data.created_at)}
            </span> <br />

        </div>
    }



    const [sellerProductDetails, setSellerProductDetails] = useState(null)
    const [verfication , setVerificaion] = useState(null)
    const navigate = useNavigate()
    const tokenStorage = new LocalStorageManager("tokens")
// 127.0.0.1:8000/seller/products/GoPro-HERO/
    const slug = useParams().id

    

    const statusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };




    const fetchSellerProductDetails = async () => {
    const access = tokenStorage.get().access
    setVerificaion(await verifyUser())


    try {
        let response =await api.get(`/seller/products/${slug}`,{
            headers:{
                "Authorization":`Bearer ${access}`
            }
        })

        console.log(response);
        setSellerProductDetails(response.data)
        
    } catch (error) {
        toast.error("Product data not found.")
        console.error("Error:", error.response.data.detail);
        
    }


}





useEffect(() => {
  fetchSellerProductDetails()

  
}, [])



    return verfication !== null && verfication.valid == true && sellerProductDetails !== null ?
    <div className="flex">
        <div className="left border-r-2 border-pink-700 p-3 w-[15%] flex items-start justify-center">
            <span className="m-2 px-4  border-pink-800 hover:bg-pink-600 hover:text-white font-semibold  p-2 rounded shadow-xl cursor-pointer transition duration-150" onClick={()=>{navigate("/seller/products/")}}>Go back</span>

        </div>
        <div className="right  p-3 w-[85%]">
            
            <div className="topinvetory flex flex-col flex-wrap md:flex-row  items-center justify-center">
                <span className=" md:w-50 m-2 mx-5 p-2 px-4 border border-gray-200 shadow rounded flex flex-col items-center justify-center ">
                    <h5 className="topic">Avaliable</h5>
                    <p className="number">{sellerProductDetails.inventory.quantity - sellerProductDetails.inventory.reserved }</p>
                </span>
                <span className=" md:w-50 m-2 mx-5 p-2 px-4 border border-gray-200 shadow rounded flex flex-col items-center justify-center ">
                    <h5 className="topic">Reserved</h5>
                    <p className="number">{sellerProductDetails.inventory.reserved}</p>
                </span>
                <span className=" md:w-50 m-2 mx-5 p-2 px-4 border border-gray-200 shadow rounded flex flex-col items-center justify-center ">
                    <h5 className="topic">Total Quantity</h5>
                    <p className="number">{sellerProductDetails.inventory.reserved+sellerProductDetails.inventory.quantity}</p>
                </span>
                
                <span className=" md:w-50 m-2 mx-5 p-2 px-4 border border-gray-200 shadow rounded flex flex-col items-center justify-center ">
                    <h5 className="topic">Ordered</h5>
                    <p className="number">{sellerProductDetails.total_ordered}</p>
                </span>

            </div>
            <div className="w-[100%] table bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                <tr>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Payment</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th> 
                    <th className="px-4 py-3 text-left font-medium">Status</th> 
                </tr>
                </thead>

                <tbody>
                {sellerProductDetails.orders.map((order, index) => (
                    <tr
                    key={index}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                    <td className="px-4 py-3 capitalize text-gray-700" title={order.name}>
                        {order.name.slice(0,30)}...
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-700">
                        {order.payment_status || "unpaid"}
                    </td>


                    <td className="px-4 py-3 text-gray-600">
                        {formatDate(order.paid_at || order.created_at)}
                    </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">
                            ₹{order.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                            <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                                order.status
                            )}`}
                            >
                            {order.status}
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>


            </div>

        <div className="reviews mt-10 ml-4 ">
            <div className="heading text-2xl font-bold">
                Reviews
            </div>
            <div className="reviewscard ">
                {
                  sellerProductDetails.reviews.length >0 && sellerProductDetails.reviews.map((ele,idx)=>{

                    return <Reviewcard data={ele} key={idx} />
                    })
                }
            </div>
        </div>

        </div>
    </div>
    :
    <div>
        Not Authorised
    </div>
}

export default SellerProductDetails