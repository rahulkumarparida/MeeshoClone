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
        setVerifyUserValue(await verifyUser())

        try {
            const response = await api.get("/users/me/" , {
                headers:{
                    "Authorization":`Bearer ${access}`
                }
            })

            console.log(response)
            
            setUserData(response.data)
            
           

        } catch (error) {
            console.error("Error while fetching user's data.")
        }
    }

useEffect(() => {
    if(tokens == false){
        setTimeout(() => {
        console.log("Loaddeed");
        navigate("/login")
    }, 400);

    }else{

        fetchUserData()
    }   
  
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
            <span className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl " onClick={()=>{navigate('/order/history/')}}>
                Order History
            </span>


        </div>


        <div className="ProfileInfo  p-5   border-r border-pink-200   w-full">
            <div className="pic flex items-center justify-center rounded-[50%]">
                <img src={userData.profile.avatar !== null ?userData.profile.avatar:"https://www.freepik.com/free-photos-vectors/blank-profile"} alt="" className="shadow-2xl h-60 w-60 object-cover rounded-[50%] " loading="lazy" />
               {userData.role =="seller"?
               <span className="m-[-50px] mt-15 shadow-xl text-white py-2 px-4 rounded  bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-600">
                Seller
               </span>
               :
               ""}
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
                {
                    userData.role == "seller" && userData.seller_profile ?
                    <div className="  mt-10 p-5  font-bold flex flex-col">

                        <span  className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">
                        Buissness Name : {userData.seller_profile.business_name}
                        </span>
                        <span  className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">
                            GST No. : {userData.seller_profile.gst_number}
                        </span >
                        <span  className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">
                            Kyc Document : {userData.seller_profile.kyc_document== null?"Not Provided":
                            <span className="border px-4 py-2 bg-pink-500 font-bold text-white ">Avaliable</span>
                            }
                        </span >
                        
                        <span  className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 ">
                            Started : {userData.seller_profile.submitted_at== null?"Not Provided":
                            <span className="border px-4 py-2 bg-pink-500 font-bold text-white ">
                                {userData.seller_profile.submitted_at.slice(0,10)}
                            </span>
                            }
                        </span >

                    </div>
                    :
                    ""
                }
            </div>

            


        </div>

    </div>

  )
:
<div className="text-xl md:text-4xl h-screen flex items-center justify-center text-gray-600 font-bold" >
    Not Authorized Login Again
</div>

  
}

export default ProfilePage