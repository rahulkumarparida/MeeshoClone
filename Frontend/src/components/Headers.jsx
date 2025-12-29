import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import meeshoLogo from "../assets/meeshoLogo.png"
import { User , Search , ShoppingCart  } from 'lucide-react'
import { Link } from 'react-router-dom'
import { verifyUser } from '../services/auth.api.js'
import api from '../services/api.js'
import { useState , useEffect  , useCallback} from 'react'
import { debounce } from 'lodash'


const Headers = () => {


  const Categories = () => {
    const [category, setCategory] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeMenuName, setActiveMenuName] = useState(null);


    const activeCategory =
      activeMenu && category
        ? category.find((cat) => cat.id === activeMenu)
        : null;

    function renderCategories(categories) {
      

      return categories.map((cat) => (
        <div key={cat.id} className="ml-4" >
          <span
            onMouseEnter={() => {
              setActiveMenu(cat.id);
              setActiveMenuName(cat.name)
            }}
            className="hover:text-pink-600 hover:border-b-4  transition cursor-pointer"
          >
            {cat.name}
          </span>
        </div>
      ));
    }

    useEffect(() => {
      const fetchCategories = async () => {
        const response = await api.get("/products/categories/");

        // console.log("category:", response);
        setCategory(response.data);
      };
      fetchCategories();
    }, []);


    return (
      <>
        <div className="flex p-4 overflow-x-scroll hide-scrollbar mt-2  border-t border-gray-400" >
          {category != null ? renderCategories(category) : ""}
        </div>
        {activeMenu != null ? (
          <div>
            {activeCategory && (
              <div className="flex flex-col  px-5 mx-10 my-2  z-10" onMouseLeave={() => {setActiveMenu(null);setActiveMenuName(null)}}>
                <span className="font-bold text-pink-700 max-w-fit">
                  {activeMenuName}
                </span>
                {activeCategory.children.map((ele) => (
                  <span key={ele.id} className="text-gray-800 font-semibold max-w-fit hover:text-pink-700 cursor-pointer m-2 my-3 transition duration-300 ">

                    {ele.name}
                    <br />
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </>
    );
  };



  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const {tokenStorage} = useAuth();
  const verifyValue = tokenStorage.exists()?verifyUser(tokenStorage.get()):false

  // http://127.0.0.1:8000/products/?search=Camera search query


const fetchSuggestion = useCallback(
  debounce(async (searchValue) => {
    if (searchValue.length > 0){
      try {
        let response = await api.get(`/products/?search=${searchValue}`)
        setSuggestions([...response.data.results])
        console.log("serach:", response);
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      }
  
    }else{
      setSuggestions([])
    }
  },300),
  [],
)


  function handleChange(e){
    e.preventDefault();
    setQuery(e.target.value)
    fetchSuggestion(e.target.value);

  }





// Main Component
  return (
    <div className="fixed   bg-white  w-full flex p-6  justify-between border-gray-300">
        <div className="h-10 w-full flex justify-between">
          <div className="logo mx-4  ">
          <Link to="/">
          <img src={meeshoLogo} title='meeshoclone' alt="logo" className='object-cover h-3 md:h-10' />
            </Link>
        </div>
        <div className={`searchbar h-100 flex flex-col  ${suggestions.length > 0?"z-30 bg-white shadow-xl border-b-4 border-l border-r":""}   border-pink-300 items-center w-120 px-3 rounded-lg `}>


          <div className='flex m-3 '>
          <Search className='text-zinc-500 mr-2' /> 
          <label htmlFor="search" className='  w-full'>
            <input type="text" name='search' className='border-none pl-1 focus:outline-none h-full  w-full' placeholder='What you want to buy ?'
            onChange={(e)=>{handleChange(e)}}
            value={query}
            />
          </label>
            </div>
            
          <div className="serachedProducts overflow-y-scroll">
            {
              <ul  className={'w-full mt-3 '}>
              {suggestions.length > 0?
              suggestions.map((ele)=>{
                 return <li className='my-1 px-4 py-1  flex border-b border-gray-400 w-full hover:bg-pink-100 cursor-pointer' key={ele.id} value={ele.slug}>
                  <img src={ele.images[0].image_url} alt="" className='h-10' />
                  <p className='mx-3' title={ele.title}>{ele.title.slice(0,60)}</p>
                  </li> 
                       
              })
              :
              ""}
               </ul>
            }
          </div>

        </div>
        <div className="authen ">
            {
              verifyValue?
              <div className=' flex'>
                <User  />
                <div className='border mx-5'></div>
                <ShoppingCart />
              </div>
              :
              <div className='flex items-center p-2' >
              <Link to='/login'  className='hover:underline '>Login</Link> 
              <div className='mx-2'>/</div> 
              <Link to='/signup' className='hover:underline '>Signup</Link>  
              
              </div>
            }
        </div>
        </div>
        <div className='z-10 left-0 absolute mt-10 mb-10 bg-white w-full shadow-2xl'>
          <Categories />
        </div>
    </div>
  )
}

export default Headers