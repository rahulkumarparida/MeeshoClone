import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductEnlistedCard = ({items}) => {

   
    const navigate = useNavigate()


  return (
    <div className='border-2 border-gray-300 rounded shadow bg-pink-100 m-10  flex  justify-evenly items-center
    hover:border-pink-600 hover:bg-pink-100 hover:shadow-xl transition saturate-100'>

        <div className="img  m-1 p-2">
            <img src={items.product_image} alt="" className='h-25 object-cover' />
        </div>
        <div className="name m-2 p-2 text-center w-[45%] font-semibold  bg-pink-200 text-pink-700 rounded cursor-pointer" 
        onClick={(e)=>{navigate(`/${items.slug}`)}} title="Navigates to the product page" >
            <p>{items.name}</p>
            
        </div>


        <div className='  md:flex '>
            <div className="inventory flex md:flex-col  ">

            <span className="inventory border border-pink-400 rounded  px-8 m-1">
                <p className='font-semibold text-pink-800'>Inventory</p>
                <p className='text-pink-600 font-bold'>{items.inventory}</p>
            </span>
            <span className="inventory  border border-pink-400 rounded  px-8 m-1">
                <p className='font-semibold text-pink-800'>Avaliable</p>
                <p className='text-pink-600 font-bold'>{items.avaliable}</p>

            </span>
            <span className="inventory  border border-pink-400 rounded  px-8 m-1">
                <p className='font-semibold text-pink-800'>Reserved</p>
                <p className='text-pink-600 font-bold'>{items.reserved}</p>

            </span>
        </div>

        <div className="review m-3 border  border-pink-400 rounded  px-8 flex flex-col items-center justify-evenly ">
            <p className='font-semibold text-pink-800'>Reviews</p>
            <p className='text-pink-600 font-bold'>{items.review_count}</p>
        </div>

        <div className="detailbutton flex m-5  items-center justify-center">
            <span className='m-2 px-4 hover:border border-pink-800 hover:bg-pink-600 hover:text-white font-semibold  p-2 rounded shadow-xl cursor-pointer transition duration-150'>
                Details
            </span>
        </div>
        </div>
        
    </div>
  )
}

export default ProductEnlistedCard