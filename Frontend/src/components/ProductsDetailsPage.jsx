import api from "../services/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, ChevronsRight, Plus, Minus } from "lucide-react";
import Headers from "./Headers";
import LocalStorageManager from "../hooks/useLocalStorage.js";
import toast from "react-hot-toast";
import ReviewAndRating from "./ReviewAndRating.jsx";

const ProductsDetailsPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [productsDetails, setProductsDetails] = useState(null);
  const [quantityCount, SetQuantityCount] = useState(1);
  const slug = useParams();
  const tokenStorage = new LocalStorageManager("tokens");

  const errorNotify = (message) => toast.error(message);
  const sucessNotify = (message) => toast.success(message);

  const fetchProductDetails = async () => {
    try {
      // console.log(slug.id);

      let response = await api.get(`/products/${slug.id}/`);
      // console.log(response);

      setProductsDetails(response.data);
    } catch (error) {
      console.error(`Error Ocuured while fetching ${slug.id} details`, error);
    }
  };

  const postCartDetails = async (params) => {
    let req = {
      product_id: productsDetails.id,
      quantity: quantityCount,
    };

    try {
      const tokens = tokenStorage.get();
      const authHead = tokens.access;
      // console.log(req, authHead);

      const response = await api.post("cart/add/", req, {
        headers: {
          Authorization: `Bearer ${authHead}`,
        },
      });

      if (response.statusText !== "OK") {
        // console.log(true);
        return errorNotify("Product is out of Stock");
      }

      setTimeout(() => {
        // console.log(response);

        return sucessNotify("Added to cart!!");
      }, 200);
    } catch (error) {
      if (error.response.data.non_field_errors[0]) {
        return errorNotify("Product is out of Stock");
      }
      // console.error("error while adding to cart:", error.response.data.non_field_errors[0]);
      return errorNotify("Error while Fetching the data");
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const handleCartClick = () => {
    postCartDetails();
  };

  return (
    <>
      {productsDetails == null ? (
        <div className="pt-80  text-center text-xl md:text-3xl">
          No information avaliable about this product
        </div>
      ) : (
        <div className="">
          <div className="headers">
            <Headers />
          </div>

          <div className=" text-black     md:flex ">
            <div className="productimgs  flex md:w-[50%] justify-evenly p-5">
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
                  className="h-110 object-contain rounded-xl "
                />
              </div>
            </div>
            <div className="details  p-5 md:w-[50%]">
              <div className="shortinfo flex flex-col">
                <span className="name text-lg text-gray-500 font-[sans]">
                  {productsDetails.title}
                </span>
                <span className="price mt-5">
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
              <div className="qunatity flex mt-2 mx-7  p-2">
                <div
                  onClick={() => {
                    quantityCount > 1
                      ? SetQuantityCount((prev) => prev - 1)
                      : SetQuantityCount(1);
                  }}
                >
                  <Minus className=" rounded-[50%] mx-2 h-7 w-7 shadow text-pink-500 hover:text-pink-700 hover:shadow-3xl border-2 border-pink-200" />
                </div>

                <span className="text-xl text-pink-600">{quantityCount}</span>
                <div
                  onClick={() => {
                    SetQuantityCount((prev) => prev + 1);
                    console.log("Click hela re");
                  }}
                >
                  <Plus className=" rounded-[50%] mx-2 h-7 w-7 shadow text-pink-500 hover:text-pink-700 hover:shadow-3xl border-2 border-pink-200" />
                </div>
              </div>
              <div className="cartbuttons m-4 mt-5 p-2 flex">
                <div
                  className="addtocart cursor-pointer flex border p-2  px-3 mx-3 rounded-sm border-pink-600 text-pink-700 shadow-xl shadow-pink-200 "
                  onClick={() => {
                    handleCartClick();
                  }}
                >
                  <ShoppingCart className="mx-2" />
                  <p>Add to Cart</p>
                </div>
                <div className="buynow cursor-pointer flex border p-2  px-3 mx-3 rounded-sm border-pink-600  text-white bg-pink-600 shadow-xl shadow-pink-200">
                  <ChevronsRight className="mx-2" />
                  <p>Buy Now</p>
                </div>
              </div>
              <div className="desc mt-10 p-3 ">
                <p className="text-2xl font-bold text-gray-700">
                  Description:{" "}
                </p>

                <p className="pl-3">{productsDetails.description}</p>
              </div>
            </div>
          </div>
          



          {/* Riviews and ratings */}

          <div className="reviewsandratings">
                  <ReviewAndRating product_id={productsDetails.id} avg_rating={productsDetails.average_rating} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsDetailsPage;
