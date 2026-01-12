import { useState , useEffect } from "react"
import api from "../services/api.js"
import { Star } from "lucide-react"
import toast from "react-hot-toast"



 


const ReviewAndRating = ({product_id ,avg_rating}) => {
    const [details, setdetails] = useState(null)
    const [text , setText] = useState("Good")
    const [color , setColor] = useState({"backgroundColor":"#de0000c0"})


const ratingColor = (rating)=>{
    if (rating == 5) {
        setText("Excellent")
        setColor({"backgroundColor":"#00fa00af"})
         
        
    }else if(rating <= 4){
        setText("Very Good")
        setColor({"backgroundColor":"#008000af"})
         
    }
    else if(rating <= 3){
        setText("Good")
        setColor({"backgroundColor":"#ffb300c0"})
          
    }
    else if(rating <=2){
        setText("Average")
        setColor({"backgroundColor":"orangered"})
       
    }
    else if(rating <=1){
        setText("Poor")
        setColor({"backgroundColor":"#ff0000c0"})
         
    }else{
        setText("Liability")
        setColor( {"backgroundColor":"#de0000c0"})
        
    }
}


    
const ReviewCard = ({review})=>{

console.log(review);

return <div className="m-3 p-3 border rounded border-gray-400 shadow">
    <div className="user font-bold text-gray-800">
        {review.user}
    </div>
    <div className="rating font-semibold">
        Rated {review.rating} to the product.
    </div>
    <div className="review border-3 p-3 m-2 rounded shadow-xl border-gray-400 font-semibold ">
        {review.comment}
    </div>
</div>
}

const fetchReviews = async () => {


    try {
        let response = await api.get(`/reviews/${product_id}/`)

    // console.log(response);
    if( response.statusText == "OK"){

        setdetails(response.data)   
    }
        
    } catch (error) {
        return toast.error("Some error ouccured")
    }
    

     
    
    
}

    useEffect(() => {
        fetchReviews()
      ratingColor(avg_rating)
    }, [])
    





  return details !== null && details.count !== 0?
  (
    <div className="border-t border-gray-400 p-3 mt-5 " >
        
            <div className="head">
          
                 <span className="text-3xl font-bold">Ratings and reviews</span>
                <span className="flex mt-3">
                   <p className="text-xl mr-1">
                    {
                        avg_rating!== null ? avg_rating : "5"
                    }
                    </p> 
                    <Star className="text-green-700"/>
                    <span className="text-white mx-2 px-3 rounded" style={color}>{text}</span>
                </span>
               
               
            </div>
            <div className="reviewCard">
                <div className="m-3 p-2 border border-gray-300 shadow rounded">
                    <div className="stars">
                        
                    </div>
                    <div className="comments">
                        <label htmlFor="comment">
                            <input id="comment" name="comment" type="text" />
                        </label>
                    </div>
               </div>
                {
                    details.results.map((ele,idx)=>{

                        return <div key={idx}>
                            <ReviewCard review={ele} />
                        </div>
                    })
                }
            </div>

    </div>
  )
  :
  (
    <div className="border p-3 px-8 mt-5 ">
            <div className="head">
                <span className="text-3xl font-bold">Ratingssss and reviews</span>
                <span className="flex mt-3">
                   <p className="text-xl mr-1">5</p> <Star className="text-green-700"/>
                    <span>

                   </span>
                </span>
            </div>
            <div className="body text-xl text-center">
                No reviews found for this products
            </div>

    </div>
  )
}

export default ReviewAndRating