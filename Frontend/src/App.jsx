import React from 'react'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App