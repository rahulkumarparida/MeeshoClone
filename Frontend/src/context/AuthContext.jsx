import React from 'react'
import { createContext ,  useContext , useState } from 'react'



const AuthContext = createContext();

export const AuthProvider =({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

  return (
   <AuthContext.Provider value={{ user, token, setUser, setToken }}>
    {children}
   </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext)
