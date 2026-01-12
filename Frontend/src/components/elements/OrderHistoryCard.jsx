import api from "../../services/api"
import { useState , useEffect } from "react"
import LocalStorageManager from "../../hooks/useLocalStorage"
import { useNavigate } from "react-router-dom"
import { CircleCheckBig ,ChevronRight} from "lucide-react"
import { capitalize } from "lodash"

const OrderHistoryCard = ({ele}) => {
  const tokens = new LocalStorageManager("tokens")
  const [status, setStatus] = useState(null)
  const [date, setDate] = useState(null)
  const navigate = useNavigate()  

  const PreOrderItemCard = ({items})=>{
    


        return <div className="p-3 border border-gray-200 shadow-xl m-2 rounded-md flex justify-evenly items-center  cursor-pointer">

            <div className="image">
              <img src={items.product.images[0].image_url} alt="" className="h-20 " />
            </div>
            <div className="detailss w-[60%]">
              <p className="font-semibold text-gray-600">
                {items.product.title.slice(0,50)}...
              </p>
              <span className="font-semibold  hover:underline"  title={items.product.slug} >
                Write a Review
              </span>
            </div>
            <div className="arrow ">
              <ChevronRight className="h-8 w-8 text-gray-700 " />
            </div>
        </div>
    }
 
  useEffect(() => {


      setStatus(capitalize(ele.status))

      const dateString =ele.created_at;
      const dateFromString = new Date(dateString);
      const comma = (dateStr)=>{
         
      dateStr.split(" ")
      const split = dateStr.substring(4).split(" ").join(",")
        
        return split

      }
      const x = comma(dateFromString.toDateString())
      setDate(x)
  
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



  return status !== null?
      (
        <div className="border rounded  border-gray-400 shadow-lg p-5 m-4" onClick={()=>{navigate(`/order/history/${ele.id}`)}}>
          <div className="status px-10 flex items-center justify-between" style={statusColor(ele.status)}>
            <span className="flex mx-3">
              {
                  ['delivered','Delivered'].includes(status) && status !== null ? 
                  <span >
                    <p className="text-xl font-bold text-shadow-2xs">

                    {status}, {date !== null ? date:" Not Avaliable" }
                      </p>
                  </span> 
                  :
                  <span >
                    <p className="text-xl font-bold text-shadow-2xs">
                        
                    {status}, {date !== null ? date:" Not Avaliable" } <br />
                    </p>  
                    <p>

                    Your Order is {ele.status} as per your request.
                      </p>
                  </span> 
              }
                <span>
          
                </span>
            </span>
            <span>
              {
                ['delivered','Delivered'].includes(status) && status !== null?
                <CircleCheckBig />
                :
                ""
              }
              
            </span>
          </div>
          {
            ele.items.map((ele,idx)=>{

              return <div key={idx}>
                <PreOrderItemCard items={ele} />
              </div>

            })
          }
          

        </div>
      )
  :
  ""

}

export default OrderHistoryCard