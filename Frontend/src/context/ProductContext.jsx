
import { createContext ,  useContext , useState } from 'react'
import api from '../services/api.js';

const ProductContext = createContext();

export const ProductProvider =({children}) => {
    const [filters, setFilters] = useState(false);
    const [category, setCategory] = useState(null);
     const [products, setProducts] = useState([]);

     

const fetchFilteredData = async (selected) => {

  if (selected.value !== null) {
      let url =`/products/?${selected.value}`
      let response =await api.get(url)


      setProducts([...response.data.results])

  }


  


}
    
  return (
   <ProductContext.Provider value={{ fetchFilteredData, filters, setFilters ,category, setCategory , products, setProducts }}>
    {children}
   </ProductContext.Provider>
  )
}


export const useProducts = () => useContext(ProductContext)
