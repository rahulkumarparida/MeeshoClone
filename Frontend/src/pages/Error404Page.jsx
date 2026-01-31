import { useEffect } from "react";



const Error404Page = () => {



    useEffect(() => {
      
    
      return () => {
         setTimeout(() => {
           window.location.replace("/")
        }, 10000);

      }
    }, [])
    

 



  return (
    <div className='h-screen  flex flex-col justify-center items-center' >
        <h1 className="text-9xl font-bold text-pink-600">404</h1>
        <p className="text-pink-700 text-sm md:text-xl font-bold">The page you are looking for does not exist.</p>
    </div>
  )
}

export default Error404Page