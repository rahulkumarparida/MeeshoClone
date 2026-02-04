
import { useState , useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useProducts } from "../../context/ProductContext.jsx";



const options = [
  { label: "All Products", value: null},
  { label: "New Arrival",  value: "ordering=created_at" },
  { label: "Price: High to Low", value: "ordering=-price" },
  { label: "Price: Low to High", value: "ordering=price" },
//   { label: "Ratings", value: "rating" },
];

const SortProductsHome = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
const {fetchFilteredData,filters, setFilters , products, setProducts} = useProducts()





useEffect(() => {
  
if (selected.value !== null) {
  fetchFilteredData(selected  )

}

  






}, [selected])






  return (
    <div className="md:m-7">
      <div className=" w-full inline-block text-sm z-0">
        {/* Button */}
        <button
          onClick={() => {setOpen(!open);  }}
          className="
          flex items-center justify-between gap-2
          px-4 py-2
          border border-gray-300
          rounded-full bg-white
          shadow-sm
          hover:border-pink-500
          transition      
        ">
          <span className="text-gray-700">
            <span className="text-gray-500 mr-1">Sort by:</span>
            {selected.label }
          </span>

          <ChevronDown
            size={18}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="
            absolute z-50 mt-2 w-fit
            bg-white rounded-xl
            border border-gray-200
            shadow-lg
            overflow-hidden
          "
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                  setFilters(true)
                }}
                className={`flex items-center justify-between px-7 py-2 text-left hover:bg-pink-50 transition
                ${selected.value === option.value? "text-pink-600 font-medium bg-pink-100": "text-gray-700"}`}
              >
                {option.label}
                {selected.value === option.value && (
                  <Check size={16} className="text-pink-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
  
    </div>
  );
};

export default SortProductsHome;
