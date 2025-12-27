import HeroBanner from "../components/HeroBanner.jsx";
import { Undo2, Birdhouse, ChevronsDown } from "lucide-react";

import StyledCategorySection from "../components/StyledCategorySection.jsx";
import SecondBanner from "../components/SecondBanner.jsx";
import ScrollBrandsComponents from "../components/ScrollBrandsComponents.jsx";
import HomeProducts from "../components/HomeProducts.jsx";
import { ProductProvider } from "../context/ProductContext.jsx";

const HomePage = () => {
  return (
    <div className="long flex flex-col ">
      <div className=" bg-[#c328da] mt-30 lg:mt-22">
        <HeroBanner />
      </div>

      <div className="stripe  border m-3 rounded-xl border-pink-400 bg-pink-100 mt-4 p-2 flex justify-evenly">
        <div className="flex px-1 mx-4 dayreturn hover:text-pink-800 transition duration-100 cursor-default ">
          {" "}
          <Undo2 className="mx-1 text-pink-600 " /> 7 Days Easy Return
        </div>
        <div className="flex px-1 mx-4 cashondelivery hover:text-pink-800 transition duration-100 cursor-default ">
          {" "}
          <Birdhouse className="mx-1 text-pink-600 " /> Cash on Delivery
        </div>
        <div className="flex px-1 mx-4  hover:text-pink-800 transition duration-100 cursor-default lowprice">
          <ChevronsDown className="mx-1 text-pink-600 " /> Lowest Prices
        </div>
      </div>

      <div className="catsectionimg">
        <StyledCategorySection />
      </div>
      <div className="secondbanner">
        <SecondBanner />
      </div>

      <div className="scrollbrand">
        <ScrollBrandsComponents />
      </div>

      <div className="homeproducts">
        <div className="head font-bold  md:text-2xl lg:text-4xl text-gray-600">
          Products For You
        </div>
        <div className="productpage">
          <ProductProvider>
            <HomeProducts />
          </ProductProvider>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
