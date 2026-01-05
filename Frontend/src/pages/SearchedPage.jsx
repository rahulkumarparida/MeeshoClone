import React from 'react'
import { useParams } from 'react-router-dom'
import Headers from '../components/Headers'
import api from '../services/api.js'
import { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductsCard from '../components/elements/ProductsCard.jsx'
const SearchedPage = () => {
    const [products, setProducts] = useState([])
    const params = useParams()
    const navigate = useNavigate()
    const options = [
  { label: "All Products", value: null},
  { label: "New Arrival",  value: "ordering=created_at" },
  { label: "Price: High to Low", value: "ordering=-price" },
  { label: "Price: Low to High", value: "ordering=price" },
//   { label: "Ratings", value: "rating" },
];

// `/products/`


const fetchFilteredData = async (selected) => {

  
      let url =`/products/?${selected}`
      let response =await api.get(url)

      console.log(response);

      setProducts([...response.data.results])

  

}
const handleProductClick = (slug)=> {
  console.log("reached",slug);
  

  navigate(`/${slug}`)
  
}

useEffect(() => {
    console.log(params.search);
    
   fetchFilteredData(`search=${params.search}`)
}, [])





  return (
    <div className='searchPage'>
        <div className="headers">
            <Headers />
        </div>
        <div className="filters">

        </div>
        <div className="productsPage  border border-pink-400 flex flex-wrap justify-evenly ">
        {products.length > 0 ?
        products.map((ele)=>{
             return (
            <div key={ele.slug} className='flex-1' >
              <ProductsCard ele={ele} onClick={() => handleProductClick(ele.slug)}  />
            </div>
          );
        })
        :
        "No Products Avaliable"
        }
        </div>
    </div>
  )
}

export default SearchedPage