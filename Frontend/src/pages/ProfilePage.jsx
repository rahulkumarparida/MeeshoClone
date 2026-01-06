import { useState , useEffect } from "react"
import LocalStorageManager from "../hooks/useLocalStorage.js"
import api from "../services/api.js"
import { verifyUser } from "../services/auth.api"
import { Camera } from "lucide-react"
const ProfilePage = () => {
    const tokenStorage = new LocalStorageManager("tokens")
    const [userData, setUserData] = useState(null)
    const tokens = tokenStorage.get()
    const [verifyUserValue , setVerifyUserValue] = useState(null)
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
    <div className="flex flex-col-reverse md:flex-row">
        <div className="leftSidebar  border-r border-pink-200  md:h-screen   flex flex-col  p-4  md:w-[31%]">
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl ">
                Home
            </span>
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl ">
                Update Profile
            </span>
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl ">
                Cart
            </span>
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl ">
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

                    <code className="p-6 border-5 mt-3 border-pink-200 rounded-xl bg-gray-200 text-black">
                        
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