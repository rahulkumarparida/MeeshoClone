import React from 'react'
import { Route, Routes } from 'react-router-dom'

// import Headers from './components/Headers.jsx'

import Login from './pages/Login' 
import Register from './pages/Register.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsDetailsPage from './components/ProductsDetailsPage.jsx'
import SearchedPage from './pages/SearchedPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import UpdateProfile from "./components/UpdateProfile.jsx"
import CartPage from './pages/CartPage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import OrderHistoryPage from './components/OrderHistoryPage.jsx'
import OrderHistoryDetailsPage from './components/OrderHistoryDetailsPage.jsx'
import SellerDashboardPage from './pages/SellerDashboardPage.jsx'
import ProductEnlnistedPage from './components/ProductEnlnistedPage.jsx'
import SellerAddProductPage from './pages/SellerAddProductPage.jsx'

import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <div className='min-h-screen cursor-default'>
      
      <Toaster/>
      <div > 
      <Routes >
        <Route path="/" element={<HomePage />} /> 
        <Route path="/:id" element={<ProductsDetailsPage />} />   
        <Route path="/login" element={<Login />} />   
        <Route path="/register" element={<Register />} />   
        <Route path="/searchedProducts/:search/" element={<SearchedPage />} />   
        <Route path="/searchedProducts/:search/:id" element={<ProductsDetailsPage />} />     
        <Route path="/profile" element={<ProfilePage />} />     
        <Route path="/profile/update/" element={<UpdateProfile />} />     
        <Route path="/cart" element={<CartPage />} />     
        <Route path="/order" element={<OrderPage />} />     
        <Route path="/order/history/" element={<OrderHistoryPage />} />     
        <Route path="/order/history/:id" element={<OrderHistoryDetailsPage />} />      
        <Route path="/seller/dashboard/" element={<SellerDashboardPage />} />      
        <Route path="/seller/products/" element={<ProductEnlnistedPage />} />      
        <Route path="/seller/products/add/" element={<SellerAddProductPage />} />      
      </Routes>
      </div>

    </div>
  )
}

export default App