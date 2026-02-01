import { useState, useEffect } from "react";
import LocalStorageManager from "../hooks/useLocalStorage.js";
import api from "../services/api.js";
import { verifyUser } from "../services/auth.api";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import meeshoLogo from "../assets/meeshoLogo.png";
import toast  from "react-hot-toast";

const UpdateProfile = () => {
//   const [userData, setUserData] = useState(null);
  const [verifyUserValue, setVerifyUserValue] = useState(null);
  const [userData, setUserData] = useState({firstName:"",lastName:"",email:"",phone:"",address:"",avatar:null,role:""})

  const [newData, setNewUserData] = useState({firstName:"",lastName:"",email:"",phone:"",address:"",avatar:null,role:""})

  const [sellerData , setSellerData] = useState({business_name: '', gst_number: '', kyc_document: null, is_approved: false, submitted_at: ''})

  const navigate = useNavigate();
  const tokenStorage = new LocalStorageManager("tokens");
  const tokens = tokenStorage?tokenStorage.get():false;
  const notify = (message) => toast(message);

//   {
//     "email": "aaaa@gmail.com",
//     "first_name": "Ajit",
//     "last_name": "Doval",
//     "phone": "73280851269",
//     "address": "Bhadrasahi , Barbil , Odisha  , Indiaa",
//     "avatar": "http://127.0.0.1:8000/media/avatars/IMG_20240417_092452_926.jpg"
// }

  const fetchUserData = async () => {

    const access = tokens?tokens.access:false;
    if (access !== false) {
      
      setVerifyUserValue(await verifyUser());
  
      try {
        const response = await api.get("/users/me/", {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
  
        console.log(response);
        setUserData({firstName:response.data.first_name ,lastName:response.data.last_name , email:response.data.email , phone:response.data.profile.phone , address:response.data.profile.address , avatar: response.data.profile.avatar ,role:response.data.role})
        if (response.data.role =="seller" && response.data.seller_profile !== null){
          setSellerData({business_name: response.data.seller_profile.business_name, gst_number: response.data.seller_profile.gst_number, kyc_document: response.data.seller_profile.kyc_document, is_approved: response.data.seller_profile.is_approved, submitted_at: response.data.seller_profile.submitted_at })
          
        }

        if (response.statusText !== "OK") {
        }
        
  
      } catch (error) {
        console.error("Error while fetching user's data.");
      }
    }else{
      verifyUserValue(false)
      setUserData({firstName:"",lastName:"",email:"",phone:"",address:"",avatar:null,role:""})
      
    }



  };

  useEffect(() => {
    if(tokens == false){
        setTimeout(() => {
        console.log("Loaddeed");
        navigate("/login")
    }, 400);

    }else{
        fetchUserData();  
    } 
  }, []);

  const handleUpdate = async () => {
    
    const access = tokens.access;
    setVerifyUserValue(await verifyUser());
    const request =   {
    "email": newData.email,
    "first_name": newData.firstName,
    "last_name": newData.lastName,
    "phone": newData.phone,
    "address": newData.address,
    "avatar": newData.avatar
}   

  const sellerRequest = {
    "email": newData.email,
    "first_name": newData.firstName,
    "last_name": newData.lastName,
    "phone": newData.phone,
    "address": newData.address,
    "avatar": newData.avatar

  }
console.log(request);

    try {
        const response = await api.patchForm("/users/me/update/", request ,{
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      
      console.log(response);
      setUserData({firstName:response.data.first_name ,lastName:response.data.last_name , email:response.data.email , phone:response.data.profile.phone , address:response.data.profile.address , avatar: response.data.profile.avatar,role:response.data.role})
      if (response.data.role =="seller" && response.data.seller_profile !== null){
          setSellerData({business_name: response.data.seller_profile.business_name, gst_number: response.data.seller_profile.gst_number, kyc_document: response.data.seller_profile.kyc_document, is_approved: response.data.seller_profile.is_approved, submitted_at: response.data.seller_profile.submitted_at })
          
        }
       if(response.statusText == "Accepted"){
                location.reload()
              return  notify("Picture will be updated once UPDATE is clicked")
            }

        
    } catch (error) {
        console.error("Error while updating!!")        
    }


  }

console.log(sellerData);


  return verifyUserValue !== null &&
    verifyUserValue.valid &&
    userData != {firstName:"",lastName:"",email:"",phone:"",address:"",avatar:null} ? (
    <div className="flex flex-col md:flex-row">
        

      <div className="leftSidebar  border-r border-pink-200  md:h-screen   flex flex-row md:flex-col p-4  md:w-[21%]">
        <span
          className=" border-2 border-transparent my-3  p-5  "
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={meeshoLogo} alt="" />
        </span>
        <span
          className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl "
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
        </span>
        <span
          className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl "
          onClick={() => {
            navigate("/cart");
          }}
        >
          Cart
        </span>
        <span
          className=" border-2 border-transparent my-3  p-5 text-center  hover:border-pink-400 transition duration-150 cursor-pointer rounded shadow hover:shadow-xl "
          onClick={() => {
            navigate("/");
          }}
        >
          Order History
        </span>
      </div>

      <div className="ProfileInfo  p-5   border-r border-pink-200   w-full">
<div className="flex items-center justify-end w-full ">
            <button className="px-8 border-2 border-pink-500 bg-pink-500 rounded-lg p-2 text-zinc-200 text-lg hover:bg-pink-600 hover:text-white  " onClick={handleUpdate}>
                Update
            </button>
        </div>

        <div className="pic flex items-center justify-center rounded-[50%] ">
          <img
            src={userData.avatar !== null ?userData.avatar:"https://www.freepik.com/free-photos-vectors/blank-profile"}
            alt="
            Visible once updated"
            className="h-60 w-60 object-cover rounded-[50%]  p-10"
            loading="lazy"
            title="Click to Change the picture"
            
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <Camera className="text-pink-500 bg-white rounded-4xl h-10 w-10 p-3 border ml-[-70px] mt-20 "/>
          <input id="file-input" type="file" accept="image/*" className="hidden"
          onChange={(e)=>{ e.target.files[0]?setNewUserData({...newData ,avatar:e.target.files[0]}):""; }}
          />    
        </label>
          
        </div>
        <div className="details  mt-10 p-5 m-7 font-bold flex flex-col ">
            <div className="name">
          <input
            className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 "
            placeholder="first name"
            value={userData.firstName!== null ?userData.firstName:""}
            onChange={(e)=>{setUserData({...userData , firstName:e.target.value}); setNewUserData({...newData ,firstName:e.target.value})}}
            ></input>
            <input
            className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 "
            placeholder="last name"
            value={userData.lastName !== null ?userData.lastName:""}
            onChange={(e)=>{setUserData({...userData , lastName:e.target.value}); setNewUserData({...newData ,lastName:e.target.value})}}
            ></input>
            </div>
          <input
            className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600 hover:border-pink-300 transition duration-100 "
            placeholder="Phone no."
            value={
              userData.phone == null ? "N/A" : userData.phone
            }
            onChange={(e)=>{setUserData({...userData , phone:e.target.value}); setNewUserData({...newData ,phone:e.target.value})}}
          ></input>
          <span className="border-l-5  m-2 md:p-3 border-transparent hover:scale-[1.08] text-gray-600  ">
            <p> Address :</p> <br />
            <input
              className="mt-4 border-l-5 border-gray-200 p-4 w-full hover:border-pink-300 transition duration-100"
              value={userData.address !== null ?userData.address:""}
              onChange={(e)=>{setUserData({...userData , address:e.target.value}); setNewUserData({...newData ,address:e.target.value})}}
              placeholder="Address"
            ></input>
          </span>

        </div>
        
      </div>

            
    
    </div>
  ) : (
  <div className="text-xl md:text-4xl h-screen flex items-center justify-center text-gray-600 font-bold" >
    {
        <div className="loadings"></div>
     
    }
    
  </div>
  );
};

export default UpdateProfile;
