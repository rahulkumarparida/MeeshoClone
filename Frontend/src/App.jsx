import React from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Headers from './components/Headers'
const App = () => {
  return (
    <div className='h-[100vh] w-[100vw]'>
      <div className='h-[12%]'>
        <Headers/>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<Login />} /> 
      </Routes>
    </div>
  )
}

export default App