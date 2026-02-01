import { useState } from "react";
import { loginUser } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";
import meeshoLogin from "../assets/meeshoLogin.webp"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const {tokenStorage } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const notify = (message , color) => toast(message,{style: {"color":color},}); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    //   const res = await loginUser({ email, password });

    const req = {
        email: email,
        password: password,
    };
    console.log(req);
    
    try {
      const res = await api.post("users/login/",req);

      console.log(res); 
      tokenStorage.set(res.data)      

      navigate('/')
      
    return notify("Logged Sucessfully" , "green")      
      
      
    } catch (err) {
      setEmail("")
      setPassword("")
      console.error("Error while login");
      return err
    }
    
  };

  return (
    <div className=" flex  flex-col items-center justify-center bg-pink-100 ">
      <form onSubmit={handleSubmit} className="mt-50 m-8 p-8 max-w-md mx-auto hover:scale-[1.08] transition">
        <img src={meeshoLogin} alt="" className="object-cover  pb-5 rounded-t-lg" />
        <h4 className="p-1  m-2 font-bold text-sm md:text-lg">Login to View your profile</h4>
      <input
      title="Please enter your email"
        className="border p-2 w-full mb-3 focus:scale-[1.01] border-gray-400  focus:border-black transition "
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
        value={email}
      />
      <input
      title="Please enter your password"
        className="border p-2 w-full mb-3 focus:scale-[1.01] border-gray-400  focus:border-black transition"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
        value={password}
      />
      <button type="submit" className="bg-black text-white px-4 py-2 w-full rounded-b-lg">
        Login
      </button>
    </form>
    </div>
  );
}
