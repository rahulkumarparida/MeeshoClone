import React from 'react'
import meeshoBanner2 from "../assets/meeshoBanner2.webp"

import meanWear from '../assets/meanWear.webp'
import jewllery from '../assets/jwellery.webp'
import homedecor from '../assets/homedecor.webp'
import womenWear from '../assets/womenWear.webp'


const SecondBanner = () => {

const designInfo = [
        {
            "img": meanWear,
            "title": "Men Wear"
        },
        {
            "img": jewllery,
            "title": "Jwellery"
        },
        {
            "img": womenWear,
            "title": "Women Wear"
        },
        {
            "img": homedecor,
            "title": "Home Decor"
        },
      
    ]



    

  return (
    <div className="secondbanner h-[200px]   sm:h-[300px] md:h-[600px]  bg-gray-200 p-6 flex" >
       <div className="empty w-[60%]"></div>
       <div className="catimgs flex  md:grid grid-cols-2 gap-4 auto-rows-fr  w-[40%] md:mt-1">
                {
            designInfo.map((ele , idx)=>{

                return <span key={idx} title={ele.title} className=' '>
                    <img src={ele.img} alt="" className='h-5 md:h-20 lg:h-35 hover:scale-[1.1] transition duration-200' loading='lazy' />
                </span>

            })
        }

       </div>

    </div>
  )
}

export default SecondBanner