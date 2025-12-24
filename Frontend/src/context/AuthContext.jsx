import React from 'react'
import { createContext ,  useContext , useState } from 'react'
import LocalStorageManager from "../hooks/useLocalStorage.js"


const AuthContext = createContext();

export const AuthProvider =({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const tokenStorage = new LocalStorageManager('tokens')


  return (
   <AuthContext.Provider value={{ user, token, setUser, setToken , tokenStorage }}>
    {children}
   </AuthContext.Provider>
  )
}


export const useAuth = () => useContext(AuthContext)
