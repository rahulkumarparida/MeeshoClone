import React from "react";
import { useEffect, useState } from "react";
import api from "../services/api.js";
import ProductsCard from "./elements/ProductsCard.jsx";
import { data, useAsyncError } from "react-router-dom";
import { useRef } from "react";
import FilterProductsHome from "./FilterProductsHome.jsx";

import { useProducts } from "../context/ProductContext.jsx";

const HomeProducts = () => {
    const {products , setProducts ,currentAPIcall, setCurrentAPIcall} = useProducts()      
    


  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState(null);

  const observerRef = useRef(null);
  const loaderRef = useRef(null);
    
  
  
  //   Infinite Scrolling
  const fetchProduct = async () => {
      setCurrentAPIcall(`/products/?page=${page}`)  
    if (isLoading || !hasNext) return;

    setLoading(true);
    setError(null);

    try {


      let response = await api.get(currentAPIcall);
      console.log(response.data);
        setHasNext(response.data.next == null ? false:true)
        setPage(prev => prev + 1);
     
      setProducts((prev) => [...prev, ...response.data.results]);

       
      
    } catch (error) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    console.log("Boolean:",currentAPIcall == "/^\/products\/\?page=\d+$");
    
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting || currentAPIcall == "/^\/products\/\?page=\d+$") {
          fetchProduct();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(loaderRef.current);

    return () => observerRef.current? observerRef.current.disconnect() :observerRef.current;

  }, [hasNext, isLoading]);
// __here__



// Filters calls
// http://127.0.0.1:8000/products/?category__slug=camera-accessories category based filter products
// http://127.0.0.1:8000/products/?price__gte=12333&price__lte= price based filter products 
// http://127.0.0.1:8000/products/?ordering=-price ordering by price - or ""
// http://127.0.0.1:8000/products/?ordering=created_at ordering bt created date





  return (
    <div className="mt-8   md:flex">
      <div className="filters md:w-[25%] border p-2">

        <FilterProductsHome />

      </div>
      <div
        id="products"
        className="  products md:w-[75%]   p-2 flex flex-wrap "
      >
        {products.map((ele, idx) => {
          return (
            <div key={idx}>
              <ProductsCard ele={ele} />
            </div>
          );
        })}

        {/* Checks if the user has scrolled to the required threshold to trigger the API call */}
        <div ref={loaderRef} className="h-20 flex items-center justify-center">
          {isLoading && <p>Loading products...</p>}
          {!hasNext && <p className="text-lg text-gray-700 p-3 m-2">No more products</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default HomeProducts;
