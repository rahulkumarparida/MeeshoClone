import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import meeshoLogo from "../assets/meeshoLogo.png"
import { User , Search , ShoppingCart  } from 'lucide-react'
import { Link } from 'react-router-dom'
import { verifyUser } from '../services/auth.api.js'


const Headers = () => {

const {tokenStorage} = useAuth();

const verifyValue = tokenStorage.exists()?verifyUser(tokenStorage.get()):false

  return (
    <div className="h-max  p-6 flex justify-between border-b-2 border-gray-300">
        <div className="logo mx-4  ">
          <Link to="/">
          <img src={meeshoLogo} title='meeshoclone' alt="logo" className='object-cover h-10' />
            </Link>
        </div>
        <div className="searchbar flex border-2 border-gray-400 items-center w-120 px-3 rounded-sm">
          <Search className='text-zinc-500 mr-2' /> 
          <label htmlFor="search" className='h-full  w-full'>
            <input type="text" name='search' className='border-none pl-1 focus:outline-none h-full  w-full' placeholder='What you want to buy ?' />

          </label>
        </div>
        <div className="authen">
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
  )
}

export default Headers