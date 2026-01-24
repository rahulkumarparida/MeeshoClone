import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
    const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "customer",
    password: "",
    password2: "",
    phone: "",
    address: "",
    avatar: null,
    business_name: "",
    gst_number: "",
    kyc_document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateStep1 = () => {
    if (!form.email || !form.first_name || !form.last_name) {
      return "All basic fields are required";
    }
    if (form.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (form.password !== form.password2) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      const response =await api.post("/users/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("response",response)
      if (response.status == 201) {
        setTimeout(() => {
            navigate("/login")
        }, 10000);
      }

    } catch (err) {
        console.error("error",err)
      setError("Registration failed. Please check inputs.");
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-[#f1f2f4] px-4">
  <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 sm:p-8">

    {/* Error */}
    {error && (
      <p className="bg-red-50 border border-red-200 text-red-700 p-2 mb-4 rounded text-sm">
        {error}
      </p>
    )}

    {/* STEP 1 */}
    {step === 1 && (
      <>
        <h2 className="text-2xl font-semibold mb-1 text-gray-800">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your basic details to continue
        </p>

        <input
          name="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          onChange={handleChange}
        />

        <div className="flex gap-3">
          <input
            name="first_name"
            placeholder="First Name"
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            onChange={handleChange}
          />

          <input
            name="last_name"
            placeholder="Last Name"
            className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            onChange={handleChange}
          />
        </div>

        <select
          name="role"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={form.role}
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          onChange={handleChange}
        />

        <button
          onClick={handleNext}
          className="w-full bg-pink-600 hover:bg-pink-700 transition text-white py-3 rounded-lg font-medium"
        >
          Continue
        </button>
      </>
    )}

    {/* STEP 2 */}
    {step === 2 && (
      <>
        <h2 className="text-2xl font-semibold mb-1 text-gray-800">
          {form.role === "seller" ? "Business Details" : "Contact Details"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Provide additional information
        </p>

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
          onChange={handleChange}
        />

        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Profile Photo</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="w-full text-sm"
            onChange={handleChange}
          />
        </div>

        {form.role === "seller" && (
          <>
            <input
              name="business_name"
              placeholder="Business Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              onChange={handleChange}
            />

            <input
              name="gst_number"
              placeholder="GST Number"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              onChange={handleChange}
            />

            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">
                KYC Document (PDF)
              </label>
              <input
                type="file"
                name="kyc_document"
                accept="application/pdf"
                className="w-full text-sm"
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setStep(1)}
            className="w-1/2 border border-gray-300 py-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            className="w-1/2 bg-pink-600 hover:bg-pink-700 transition text-white py-3 rounded-lg font-medium"
          >
            Register
          </button>
        </div>
      </>
    )}
  </div>
</div>
  );
}