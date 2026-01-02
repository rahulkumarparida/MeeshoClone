
import api from "../services/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, ChevronsRight } from "lucide-react";


const ProductsDetailsPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
const [productsDetails, setProductsDetails] = useState(null)
  let slug = useParams();
  

const fetchProductDetails = async () => {
    try {
        console.log(slug.id);
        let response = await api.get(`/products/${slug.id}/`)  
        console.log(response);
        
        setProductsDetails(response.data)
        
    } catch (error) {
        console.error(`Error Ocuured while fetching ${slug.id} details`,error)
    }
    
}




  useEffect(() => {
    
    fetchProductDetails()
  
    
  }, [])
  


  return (
    <>
    {
    productsDetails == null ?
        <div className="pt-80  text-center text-xl md:text-3xl">
            No information avaliable about this product
        </div>
        :
    <div className="text-black  pt-35    flex">
      <div className="productimgs  flex w-[50%] justify-evenly p-5">
        <div className="allImages">
          {productsDetails.images.length == 0
            ? "No images"
            : productsDetails.images.map((img) => {
                return (
                  <div
                    key={img.id}
                    className={`${
                      selectedImage == img.image_url ? "border-2" : ""
                    } border-pink-700  m-3 rounded-xl shadow-3xl`}
                    onClick={() => {
                      setSelectedImage(img.image_url);
                    }}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      className="h-16 object-cover rounded-xl"
                    />
                  </div>
                );
              })}
        </div>
        <div className="mainImg  flex ">
          <img
            src={
              selectedImage !== null
                ? selectedImage
                : productsDetails.images[0].image_url
            }
            alt=""
            className="h-110 object-contain rounded-xl shadow-2xl"
          />
        </div>
      </div>
      <div className="details  p-5 w-[50%]">
        <div className="shortinfo">
          <span className="name text-lg text-gray-500 font-[sans]">
            {productsDetails.title}
          </span>
          <span className="price ">
            <p className="text-xl font-bold">₹{productsDetails.price}</p>
            <p className="text-2xl text-gray-400 line-through">
              ₹{productsDetails.price * 1.5}
            </p>
          </span>
          <div className="flex">
            <span className="ratings flex items-center rounded-4xl w-12 justify-center bg-green-600">
              {productsDetails.average_rating == null
                ? 5
                : productsDetails.average_rating}{" "}
              &#9733;
            </span>
            <p className="text-sm text-gray-600 ml-2">{`${productsDetails.review_count} reviews`}</p>
          </div>
        </div>
        <div className="cartbuttons m-4 mt-8 flex">
          <div className="addtocart flex border p-2  px-3 mx-3 rounded-sm border-pink-600 text-pink-700 shadow-xl shadow-pink-200">
            <ShoppingCart className="mx-2" />
            <p>Add to Cart</p>
          </div>
          <div className="buynow flex border p-2  px-3 mx-3 rounded-sm border-pink-600  text-white bg-pink-600 shadow-xl shadow-pink-200">
            <ChevronsRight className="mx-2" />
            <p>Buy Now</p>
          </div>
        </div>
        <div className="desc mt-10 p-3 ">
          <p className="text-2xl font-bold text-gray-700">Description: </p>

          <p className="pl-3">{productsDetails.description}</p>
        </div>
      </div>
    </div>
    }
    </>
  );
};

export default ProductsDetailsPage;
