import React from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'

import Headers from './components/Headers.jsx'

const App = () => {
  return (
    <div className='min-h-screen'>
      <div className='  '>
        <Headers/>
      </div>
      
      <div > 

      <Routes >
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<Login />} /> 
      </Routes>
      </div>
    </div>
  )
}

export default App