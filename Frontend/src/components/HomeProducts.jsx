import React from "react";
import { useEffect, useState } from "react";
import api from "../services/api.js";
import ProductsCard from "./elements/ProductsCard.jsx";
import { data, useAsyncError , useNavigate } from "react-router-dom";
import { useRef } from "react";
import SortProductsHome from "./elements/SortProductsHome.jsx";

import { useProducts } from "../context/ProductContext.jsx";
import FilterProductsHome from "./elements/FilterProductsHome.jsx";
import { Link } from "lucide-react";




// Task Complete instead of using Link for redirection change to useNavigate()
const HomeProducts = () => {

  const { filters,setFilters, products, setProducts } = useProducts();

  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState(null);
  
  const observerRef = useRef(null);
  const loaderRef = useRef(null);
  const navigate = useNavigate();




  //   Infinite Scrolling
  const fetchProduct = async () => {
    console.log("page value:", page);
    

    if (isLoading || !hasNext) return;

    setLoading(true);
    setError(null);

    try {
      const buildProductsURL = `/products/?page=${page}`;

      let response = await api.get(buildProductsURL);
      console.log("Home Res: ",response);
      
      setHasNext(response.data.next == null ? false : true);
      setPage((prev) => prev + 1);  
      setProducts((prev) => [...prev, ...response.data.results]);
    } catch (error) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {

  //   fetchProduct();

  // }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setFilters(false)
        if (filters==true) return console.log("filters",filters);
        ;
        if (entries[0].isIntersecting ) {
          console.log("Done");
          
          fetchProduct();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observerRef.current.observe(loaderRef.current);

    return () =>
      observerRef.current
        ? observerRef.current.disconnect()
        : observerRef.current;
  }, [hasNext, isLoading]);

const handleProductClick = (slug)=> {
  console.log("reached",slug);
  

  navigate(`/product/${slug}`)
  
}

  // __here__

  // Filters calls
  // http://127.0.0.1:8000/products/?category__slug=camera-accessories category based filter products
  // http://127.0.0.1:8000/products/?price__gte=12333&price__lte= price based filter products
  // http://127.0.0.1:8000/products/?ordering=-price ordering by price - or ""
  // http://127.0.0.1:8000/products/?ordering=created_at ordering bt created date

  return (
    <div className="mt-8   md:flex">

      <div className=" filters md:w-[25%] border-r-2 border-pink-200 p-2">
        <div>
          <SortProductsHome />
        </div>
        <div>
            <FilterProductsHome />
        </div>
      </div>

      <div
        id="products"
        className="  products md:w-[75%]   p-2 flex flex-wrap "
      >
        {products.length == 0?<div className="text-4xl text-gray-700">Products are not availiable right now.</div>:products.map((ele, idx) => {
          return (
            <div key={ele.slug}  >
              <ProductsCard ele={ele} onClick={() => handleProductClick(ele.slug)}  />
            </div>
          );
        })}

        {/* Checks if the user has scrolled to the required threshold to trigger the API call */}
        <div ref={loaderRef} className="h-20 flex items-center justify-center">
          {isLoading && <div className="loadings"></div>}
          {!hasNext && (
            <div className="lg:text-2xl text-gray-700 p-3 m-2 text-center">
              No more products 
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;
