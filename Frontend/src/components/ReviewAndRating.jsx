import { useState, useEffect } from "react";
import api from "../services/api.js";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import blankstar from "../assets/blankstar.png";
import fillstar from "../assets/fillstar.png";
import LocalStorageManager from "../hooks/useLocalStorage.js";
import { verifyUser } from "../services/auth.api.js";

const ReviewAndRating = ({ product_id, avg_rating }) => {
  const token = new LocalStorageManager("tokens");
  const [details, setdetails] = useState(null);
  const [text, setText] = useState("Good");
  const [color, setColor] = useState({ backgroundColor: "#de0000c0" });
  const [ratingCount, setRatingCount] = useState(0);
  const [review, setReview] = useState("");
  const [reviewCheck, setReviewCheck] = useState("Type your review here...");

  const ratingColor = (rating) => {
    if (rating == 5) {
      setText("Excellent");
      setColor({ backgroundColor: "#00fa00af" });
    } else if (rating <= 4) {
      setText("Very Good");
      setColor({ backgroundColor: "#008000af" });
    } else if (rating <= 3) {
      setText("Good");
      setColor({ backgroundColor: "#ffb300c0" });
    } else if (rating <= 2) {
      setText("Average");
      setColor({ backgroundColor: "orangered" });
    } else if (rating <= 1) {
      setText("Poor");
      setColor({ backgroundColor: "#ff0000c0" });
    } else {
      setText("Liability");
      setColor({ backgroundColor: "#de0000c0" });
    }
  };
  
  
  
  const ReviewCard = ({ review }) => {
 
      
      return (
          <div className="m-3 p-3 border rounded border-gray-400 shadow">
        <div className="user font-bold text-gray-800">{review.user}</div>
        <div className="rating font-semibold">
          Rated {review.rating} to the product.
        </div>
        <div className="review border-3 p-3 m-2 rounded shadow-xl border-gray-400 font-semibold ">
          {review.comment}
        </div>
      </div>
    );
  };

  const fetchReviews = async () => {
    try {
      let response = await api.get(`/reviews/${product_id}/`);

      if (response.statusText == "OK") {
        setdetails(response.data);
      }
    } catch (error) {
      return toast.error("Some error ouccured");
    }
  };
  
  
  useEffect(() => {
    fetchReviews();
    ratingColor(avg_rating);
  }, []);
  
  
      const postReview = async (productId, rating, reviews) => {
          const access = token.get().access;
  
          try {
          const req = {
              product: productId,
              rating: rating,
              comment: reviews,
          };
          let response = await api.post(`/reviews/${product_id}/`, req, {
              headers: {
              Authorization: `Bearer ${access}`,
              },
          });
  
          if ((response.status = 201)) {
            setTimeout(() => {
                    location.reload()
                }, 300);

              return toast.success("Review added sucessfully",{position: 'bottom-center'});
          }
          } catch (error) {
                
          return toast.error("Review of this product from the user already exists.",{position: 'bottom-center'});
          }
      };


const handleReview = ()=>{
    const productId = Number(product_id)
    const rating= Number(ratingCount)
    const reviews =review
    if (review.length < 15) {
        setReviewCheck("Min length of the review should be 15chars...")
        return toast("Review is too small...",{position: 'bottom-center'})
    }

    postReview(productId , rating ,reviews)
    setRatingCount(0)
    setReview("")
    setReviewCheck("Type your review here...")

    

}




  return details !== null && details.count !== 0 ? (
    <div className="border-t border-gray-400 p-3 mt-5 ">
      <div className="head">
        <span className="text-3xl font-bold">Ratings and reviews</span>
        <span className="flex mt-3">
          <p className="text-xl mr-1">
            {avg_rating !== null ? avg_rating : "5"}
          </p>
          <Star className="text-green-700" />
          <span className="text-white mx-2 px-3 rounded" style={color}>
            {text}
          </span>
        </span>
      </div>

      <div className="reviewCard">

        <div className="m-3 p-3 border border-gray-300 shadow rounded flex items-end justify-between">
          <div className="flex- flex-col">
            <div className="headd text-xl font-semibold text-gray-600">
              <p>Rate the Product</p>
            </div>

            <div className="stars my-3 px-3 py-2">
              {ratingCount == 0 ? (
                <div className="stars flex">
                  {[...Array(5)].map((star, index) => {
                    return (
                      <img
                        key={index}
                        id={index}
                        src={blankstar}
                        alt=""
                        className="h-9 w-9"
                        onClick={(e) => {
                          setRatingCount(
                            ratingCount + index <= 5
                              ? ratingCount + index + 1
                              : index + 1
                          );
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className=" flex">
                  {[...Array(ratingCount)].map((star, index) => {
                    return (
                      <img
                        key={index}
                        id={index}
                        src={fillstar}
                        alt=""
                        className="h-9 w-9"
                        onClick={(e) => {
                          setRatingCount(index + 1);
                        }}
                      />
                    );
                  })}
                  {[...Array(5 - ratingCount)].map((star, index) => {
                    return (
                      <img
                        key={index}
                        id={index}
                        src={blankstar}
                        alt=""
                        className="h-9 w-9"
                        onClick={(e) => {
                          setRatingCount(
                            ratingCount + index <= 5
                              ? ratingCount + index + 1
                              : index + 1
                          );
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="comments  flex items-end ">
              <label htmlFor="comment">
                <textarea
                  id="comment"
                  name="comment"
                  type="text"
                  placeholder={`${reviewCheck}`}
                  className="hide-scrollbar border-b-2 outline-none p-2 h-9 w-180"
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    
                  }}
                />
              </label>
            </div>

          </div>

          <div className="button px-5 py-3">
            <button
              type="submit"
              className=" border px-5 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white"
              disabled={review.length === 0}
              onClick={() => {
                handleReview()
              }}
            >
              Add
            </button>
          </div>
        </div>

        {details.results.map((ele, idx) => {
          return (
            <div key={idx}>
              <ReviewCard review={ele} />
            </div>
          );
        })}
      </div>

    </div>
  ) : (
    <div className="border p-3 px-8 mt-5 ">
      <div className="head">
        <span className="text-3xl font-bold">Ratings and reviews</span>
        <span className="flex mt-3">
          <p className="text-xl mr-1">5</p> <Star className="text-green-700" />
          <span></span>
        </span>
      </div>
      
        <div className="m-3 p-3 border border-gray-300 shadow rounded flex items-end justify-between">
          <div className="flex- flex-col">
            <div className="headd text-xl font-semibold text-gray-600">
              <p>Rate the Product</p>
            </div>

            <div className="stars my-3 px-3 py-2">
              {ratingCount == 0 ? (
                <div className="stars flex">
                  {[...Array(5)].map((star, index) => {
                    return (
                      <img
                        key={index}
                        id={index}
                        src={blankstar}
                        alt=""
                        className="h-9 w-9"
                        onClick={(e) => {
                          setRatingCount(
                            ratingCount + index <= 5
                              ? ratingCount + index + 1
                              : index + 1
                          );
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className=" flex">
                  {[...Array(ratingCount)].map((star, index) => {
                    return (
                      <img
                        key={index}
                        id={index}
                        src={fillstar}
                        alt=""
                        className="h-9 w-9"
                        onClick={(e) => {
                          setRatingCount(index + 1);
                        }}
                      />
                    );
                  })}
                  {[...Array(5 - ratingCount)].map((star, index) => {
                    return (
                      <img
                        key={index}
                        id={index}
                        src={blankstar}
                        alt=""
                        className="h-9 w-9"
                        onClick={(e) => {
                          setRatingCount(
                            ratingCount + index <= 5
                              ? ratingCount + index + 1
                              : index + 1
                          );
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="comments  flex items-end ">
              <label htmlFor="comment">
                <textarea
                  id="comment"
                  name="comment"
                  type="text"
                  placeholder={`${reviewCheck}`}
                  className="hide-scrollbar border-b-2 outline-none p-2 h-9 w-180"
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    
                  }}
                />
              </label>
            </div>

          </div>

          <div className="button px-5 py-3">
            <button
              type="submit"
              className=" border px-5 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white"
              disabled={review.length === 0}
              onClick={() => {
                handleReview()
              }}
            >
              Add
            </button>
          </div>
        </div>
      <div className="body text-xl text-center">
        {
        <div className="loadings"></div>
        }
      </div>
    </div>
  );
};

export default ReviewAndRating;
