import { useState , useEffect } from 'react';
import { ChevronDown, Plus, Tag, IndianRupee, FileText, Layers, Image } from 'lucide-react';
import api from '../services/api';
import loader from "../assets/loader.gif";
import { useNavigate } from 'react-router-dom';
const FormProductDetails = ({ Authtokens }) => {

const navigate = useNavigate()
const [category, setCategory] = useState(null)
const [newProduct, setNewProduct] = useState({
  title: "",
  slug: "",
  description: "",
  price: "",
  category: "",
  images: []        // now array
})

const [previewImages, setPreviewImages] = useState([]);
const [loading, setLoading] = useState(false);

const categoryDetails = async () => {
  try {
    const response = await api.get("/products/categories/");
  
    setCategory(response.data);
  } catch (e) {}
}

useEffect(() => {
  categoryDetails()
}, [])

/* ---------- Image Handler ---------- */
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  setNewProduct((prev) => ({
    ...prev,
    images: files
  }));

  // preview
  const previews = files.map((file) => URL.createObjectURL(file));
  setPreviewImages(previews);
}

/*------slug creator----------- */
function createSlug(text) {
  return text
    .toString()
    .normalize('NFD')                   // Normalize special characters
    .replace(/[\u0300-\u036f]/g, '')     // Remove accent marks
    .toLowerCase()                      // Convert to lower case
    .trim()                             // Trim whitespace from both sides
    .replace(/\s+/g, '-')               // Replace spaces with -
    .replace(/[^\w-]+/g, '')            // Remove all non-word chars
    .replace(/--+/g, '-');              // Replace multiple - with single -
}

/* ---------- Submit ---------- */
const sendProductDetails = async (e) => {
  e.preventDefault();
  setLoading(true);
  const access = Authtokens.get().access
  const slug = createSlug(newProduct.title)
  setNewProduct({...newProduct , slug:slug})
  try {
    const formData = new FormData();

    formData.append("title", newProduct.title);
    formData.append("slug", slug);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);

    newProduct.images.forEach((img) => {
      formData.append("images", img);
    });


    const response = await api.post("/products/", formData, {
      headers: { Authorization: `Bearer ${access}` }
    });

    navigate(`/${response.data.slug}`)


  } catch (error) {
    toast.error(error);
  } finally {
    setLoading(false);
  }
}

  return (
   <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-pink-100">
        
        {/* Header Section */}
        <div className="bg-pink-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Add New Product
          </h2>
          <p className="text-pink-100 text-sm mt-1">Fill in the details to list your item</p>
        </div>

        {/* Form Section */}
        <form onSubmit={sendProductDetails} className="p-8 space-y-6">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-500" />
              Product Title
            </label>
            <input
              type="text"
              placeholder="e.g., Summer Floral Dress"
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-pink-500" />
                Price
              </label>
              <input
                type="number"
                min={1}
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-500" />
                Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <option value="" disabled>Select...</option>
                {category !== null && category.map((ele) => (
                  <option key={ele.id} value={ele.id}>{ele.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ---------- Image Upload ---------- */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Image className="w-4 h-4 text-pink-500" />
              Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full"
              onChange={handleImageChange}
            />

            {/* Preview */}
            {previewImages.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-3">
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="preview"
                    className="h-20 w-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-500" />
              Description
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>

          {/* ---------- Submit / Loader ---------- */}
          {!loading ? (
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-lg shadow-lg"
            >
              Next
            </button>
          ) : (
            <div className="w-full flex justify-center py-3">
              <img src={loader} alt="loading" className="h-10" />
            </div>
          )}

        </form>
      </div>
    </div>
  )
}

export default FormProductDetails
