import React from 'react'

import meeshoBanner from "../assets/meeshoBanner.webp"

const HeroBanner = () => {
  return (
    <div className='w-[99%]'>
        <img src={meeshoBanner} alt="" className=' lg:w-full object-cover ' />
    </div>
   
  )
}

export default HeroBanner