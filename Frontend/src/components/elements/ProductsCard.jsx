


const ProductsCard = ({ele}) => {



  return (

    <div className='m-4 p-4 border border-gray-400 rounded-xl shadow-lg w-fit hover:shadow-2xl transition duration-300 delay-60 flex flex-col justify-center items-center lg:w-60 cursor-pointer' title={ele.title}>
      
       <div className="img">
        <img src={ele.images[0].image_url} alt="img" className='object-cover h-40' />
       </div>
       <div className="details">
        <span className="Name  overflow-hidden text-md text-gray-700 font-bold">{ele.title.slice(0,20)}...</span>
        <hr className='text-gray-500 my-2' />
        <span>
            <p className="mainprice font-bold">${ele.price}</p>
            <p className="actualprice text-gray-500 line-through">${ele.price*1.5}</p>
        </span>
        <span className='flex mt-2'>
            <p className="rating p-2 px-4 rounded-4xl bg-green-600 text-white">{ele.average_rating == null ? 5:ele.average_rating} &#9733;</p>
            <p className="counts p-2 px-3 text-gray-600">{ele.review_count} Reviews</p>
        </span>
       </div>

   

    </div>
  )
}

export default ProductsCard