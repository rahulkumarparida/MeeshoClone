import React from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'

import Headers from './components/Headers.jsx'
import ProductsDetailsPage from './components/ProductsDetailsPage.jsx'
import SearchedPage from './pages/SearchedPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CartPage from './pages/CartPage.jsx'
const App = () => {
  return (
    <div className='min-h-screen'>
      {/* <div className=''>
        <Headers/>
      </div> */}
      
      <div > 

      <Routes >
        <Route path="/" element={<HomePage />} /> 
        <Route path="/:id" element={<ProductsDetailsPage />} />   
        <Route path="/cart" element={<CartPage />} />   
        <Route path="/login" element={<Login />} />   
        <Route path="/searchedProducts/:search/" element={<SearchedPage />} />   
        <Route path="/searchedProducts/:search/:id" element={<ProductsDetailsPage />} />     
        <Route path="/profile" element={<ProfilePage />} />     
      </Routes>
      </div>
    </div>
  )
}

export default App