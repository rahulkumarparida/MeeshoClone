import HeroBanner from "../components/HeroBanner.jsx";
import { Undo2, Birdhouse, ChevronsDown } from "lucide-react";

import StyledCategorySection from "../components/StyledCategorySection.jsx";
import SecondBanner from "../components/SecondBanner.jsx";
import ScrollBrandsComponents from "../components/ScrollBrandsComponents.jsx";
import HomeProducts from "../components/HomeProducts.jsx";
import { ProductProvider } from "../context/ProductContext.jsx";
import Headers from "../components/Headers.jsx";
const HomePage = () => {
  return (
    <div className="long flex flex-col ">
      <div className="header">
        <Headers />
      </div>
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
        <div className="head font-bold  md:text-2xl lg:text-4xl text-gray-600 ml-3 md:ml-7">
          Products For You
        </div>
        <div className="productpage">
          <ProductProvider>
            <HomeProducts />
          </ProductProvider>
        </div>
      </div>



    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-2xl font-bold text-pink-600">
            MeeshoClone
          </h2>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            This website is a demo project built for learning purposes.
            It is not affiliated with Meesho or any business organization.
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">
              Download on Play Store
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:opacity-90">
              Download on App Store
            </button>
          </div>
        </div>


        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Useful Links
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-pink-600 cursor-pointer">
              About Us
            </li>
            <li className="hover:text-pink-600 cursor-pointer">
                 <a href="https://www.linkedin.com/in/rahul-kumar-parida-b6219a292/"
              target="_blank"
              className="text-pink-600 hover:underline"
              >
              Linkedin
                </a>
              
            </li>
            <li className="hover:text-pink-600 cursor-pointer">
              <a href="https://dev.to/rahul_kumarparida_6c16f5"
              target="_blank"
              className="text-pink-600 hover:underline"
              >
              Blog
                </a>
            </li>
            <li className="hover:text-pink-600 cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Help & Support
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-pink-600 cursor-pointer">
              FAQ
            </li>
            <li className="hover:text-pink-600 cursor-pointer">
              Shipping Policy
            </li>
            <li className="hover:text-pink-600 cursor-pointer">
              Return Policy
            </li>
            <li className="hover:text-pink-600 cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>


        <div>
          <h3 className="font-semibold text-gray-900 mb-4">
            Developer Info
          </h3>

          <p className="text-gray-600 text-sm mb-3">
            Built with ❤️ by Rahul Kumar Parida.
          </p>

          <div className="flex flex-col gap-2 text-sm">
            <a
              href="https://www.rahulkumarparida.me/"
              target="_blank"
              className="text-pink-600 hover:underline"
            >
              Portfolio →
            </a>

            <a
              href="https://github.com/rahulkumarparida"
              target="_blank"
              className="text-pink-600 hover:underline"
            >
              GitHub →
            </a>

            <a
              href="https://www.meesho.com/"
              target="_blank"
              className="text-gray-600 hover:text-pink-600"
            >
              Visit Original Meesho →
            </a>
          </div>
        </div>
      </div>

  
      <div className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        ⚠️ Demo Project Only — No real payments or shopping transactions.
      </div>
    </footer>



    </div>
  );
};

export default HomePage;
