import React from 'react'
import { createContext ,  useContext , useState } from 'react'
import LocalStorageManager from "../hooks/useLocalStorage.js"


const ProductContext = createContext();

export const ProductProvider =({children}) => {
    const [filters, setFilters] = useState(null);
    const [category, setCategory] = useState(null);
     const [products, setProducts] = useState([]);
  const [currentAPIcall, setCurrentAPIcall] = useState(`/products/?page=1`);

    console.log("APICALL:" , currentAPIcall);
    
  return (
   <ProductContext.Provider value={{ filters, setFilters ,category, setCategory , products, setProducts , currentAPIcall, setCurrentAPIcall }}>
    {children}
   </ProductContext.Provider>
  )
}


export const useProducts = () => useContext(ProductContext)
