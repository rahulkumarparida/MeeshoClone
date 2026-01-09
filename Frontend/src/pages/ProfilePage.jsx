import { useState , useEffect } from "react"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import api from "../services/api.js"
import { verifyUser } from "../services/auth.api"
import { Camera } from "lucide-react"
import { useNavigate } from "react-router-dom"
import meeshoLogo from "../assets/meeshoLogo.png"

const ProfilePage = () => {
    const [userData, setUserData] = useState(null)  
    const [verifyUserValue , setVerifyUserValue] = useState(null)   
    
    const navigate = useNavigate()
    const tokenStorage = new LocalStorageManager("tokens")
    const tokens = tokenStorage.get()

    const fetchUserData = async ()=>{
        const access = tokens.access
        setVerifyUserValue(await verifyUser(tokens))

        try {
            const response = await api.get("/users/me/" , {
                headers:{
                    "Authorization":`Bearer ${access}`
                }
            })

            console.log(response)
            if(response.statusText !== "OK"){
                
            }

            setUserData(response.data)


        } catch (error) {
            console.error("Error while fetching user's data.")
        }
    }

useEffect(() => {
  fetchUserData()
  
}, [])


return verifyUserValue !== null&& verifyUserValue.valid && userData != null ?
 (
    <div className="flex flex-col md:flex-row">
        <div className="leftSidebar  border-r border-pink-200  md:h-screen   flex flex-row md:flex-col p-4  md:w-[21%]">
            <span className=" border-2 border-transparent my-3  p-5  " onClick={()=>{navigate('/')}}>
                <img src={meeshoLogo} alt="" />
            </span>
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl"  onClick={()=>{navigate('/profile/update')}} >
                Update Profile
            </span>
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl " onClick={()=>{navigate('/cart')}}>
                Cart
            </span>
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl " onClick={()=>{navigate('/')}}>
                Order History
            </span>
        </div>
        <div className="ProfileInfo  p-5   border-r border-pink-200   w-full">
            <div className="pic flex items-center justify-center rounded-[50%]">
                <img src={userData.profile.avatar} alt="" className="h-60 w-60 object-cover rounded-[50%] " loading="lazy" />
                {/* <Camera className="text-pink-500 bg-white rounded-4xl h-10 w-10 p-3 border m-[-30px] mt-20 "/> */}
            </div>
            <div className="details  mt-10 p-5 m-7 font-bold flex flex-col ">
                <span  className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">
                    Name : {userData.first_name+" "+userData.last_name}
                </span>
                <span  className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">
                    Email : {userData.email}
                </span >
                <span className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">
                    Phone no. : {userData.profile.phone == null ?"N/A":userData.profile.phone}
                </span>
                <span  className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">

                   <p> Address :</p> <br />

                    <code className="mt-4 border-2 border-gray-200 p-4 w-full">
                        
                    {
                        userData.profile.address
                    }
                    </code> 
                </span>
            </div>
        </div>
    </div>
  )
:
"Not Authorized Login Again"

  
}

export default ProfilePage