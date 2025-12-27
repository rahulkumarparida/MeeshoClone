import React from 'react'

import { Link } from "react-router-dom";

import watches from "../assets/Watches.png"
import mobileAccessories from "../assets/Mobile Accessories.png"
import cameraAccesories from "../assets/Camera Accesories.png"
import laptopAccessories from "../assets/Laptop Accessories.png"
import clothes from "../assets/Clothes.png"

const StyledCategorySection = () => {

    const designInfo = [
        {
            "img": watches,
            "title": "Watches"
        },
        {
            "img": mobileAccessories,
            "title": "Mobile Accessories"
        },
        {
            "img": cameraAccesories,
            "title": "Camera Accesories"
        },
        {
            "img": laptopAccessories,
            "title": "Laptop Accessories"
        },
        {
            "img": clothes,
            "title": "Clothes"
        },
    ]









  return (
    <div className='flex mt-10 mb-10 pb-10 justify-evenly border-b border-pink-200 shadow-sm shadow-pink-300'>
        {
            designInfo.map((ele , idx)=>{

                return <span key={idx} title={ele.title} className=' hover:scale-[1.1] transition delay-75 duration-200'>
                    <img src={ele.img} alt="" className='h-20 lg:h-50 ' loading='lazy' />
                </span>

            })
        }
    </div>
  )
}

export default StyledCategorySection