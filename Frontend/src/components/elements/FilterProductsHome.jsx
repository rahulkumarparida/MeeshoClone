import { useState, useEffect } from "react";
import api from "../../services/api.js";
import { useProducts } from "../../context/ProductContext";
import { ChevronDown , ChevronUp } from "lucide-react";
import toast from "react-hot-toast";




// Filters calls
// http://127.0.0.1:8000/products/?category__slug=camera-accessories category based filter products

const FilterProductsHome = () => {
  const [selectedCat, setSelectedCat] = useState(null);
  const {filters, setFilters, products, setProducts } = useProducts();
  const [fetchedCategories, setFetchedCategories] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // Fetches Category 
  const fetchCatergory = async () => {
    try{

          const response = await api.get("/products/categories/");
         
  
            setFetchedCategories(response.data);
        return
        }   
        catch(err){
          
          return toast.error("error occured while fetching catgories")
          
        }
    
 
  };
  useEffect(() => {
    fetchCatergory();
  }, []);
// __________________




// Fetches FIletred data
const fetchfiletrdData = async () => {
    let url = `/products/?category__slug=${selectedCat}`
    if (selectedCat !== null) {

        let response =await api.get(url)
       
         response.data.length > 0?
         setProducts([...response.data])
         :
            setProducts([])
   
    }
    
}

useEffect(() => {

  fetchfiletrdData()
  setFilters(true)    


 
}, [selectedCat])

// _____________________________________



  const renderCategories = (ele) => {
    if (!ele.children) return;

    if (ele.children.length > 0) {

      return (
        <div
          name={ele.name}
          id={ele.id}
          className={`cursor-default flex flex-wrap md:block   `}

        >
            <div className="flex  hover:text-pink-500 transition duration-200 my-3 ml-1"
            name={ele.name}
            id={ele.id} 
            onClick={(e) => {
            setIsOpen(!isOpen);
            setSelectedId(e.target.id);
          }}>
          {ele.name }
           {
            isOpen && selectedId == ele.id ? <ChevronUp id={ele.id} 
            onClick={(e) => {
            setIsOpen(!isOpen);
            setSelectedId(e.target.id);

          }}
          
          
          />: <ChevronDown id={ele.id} 
            onClick={(e) => {
            setIsOpen(!isOpen);
            setSelectedId(e.target.id);
            
          }} 

          />
           }
                </div>

          {ele.children.map((elem) => {

            return elem.children.length > 0 ? (
              renderCategories(elem)
            ) : (
              <span
                key={elem.id}
                value={elem.slug}
                onClick={(e)=>{setSelectedCat(e.target.getAttribute("value"));
                }}
                className={`ml-4 cursor-pointer border border-gray-300 p-2  ${
                  isOpen && selectedId == ele.id ? "flex flex-col" : "hidden"
                } hover:text-pink-500 transition duration-200 active:text-pink-500`}
              >
                {elem.name}
              </span>
            );
          })}
        </div>
      );
    } else {
      return <option value={ele.slug} >{ele.name}</option>;
      
    }
  };


  return (
    <div className="flex flex-col  text-gray-600 text-lg">
      <div className="filterhead font-bold ml-9">
        <span className="">
          FILTER
          <p className="text-xs">100+ products</p>
        </span>
      </div>
      <hr className="text-gray-300 border mt-4 mx-5" />

      <div className="categories flex felx-col  md:block px-6  mt-3">
        <span>Category :</span>
        <br />
        <div className="cats">
          {fetchedCategories !== null
            ? fetchedCategories.map((ele, idx) => {
                return (
                  <div
                    key={ele.id}
                    className="ml-2 text-gray-900"
                  >
                    {renderCategories(ele)}
                  </div>
                );
              })
            : "NA"}
        </div>
      </div>
    </div>
  );
};

export default FilterProductsHome;
