import { verifyUser } from "../services/auth.api";
import api from "../services/api";
import LocalStorageManager from "../hooks/useLocalStorage";
import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import Headers from "../components/Headers";

const SellerDashboardPage = () => {
  const tokens = new LocalStorageManager("tokens");
  const [dashboardData, setDashboardData] = useState(null);
  const [verification, setVerification] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [amount, setAmount] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const navigate = useNavigate();

  const splitobject = (arr) => {
    if (!arr || arr.length === 0) return { arr1: [], arr2: [] };

    const groups = {};

    arr.forEach((item) => {
      // Extract YYYY-MM-DD
      const date = item.created_at.slice(0, 10);
      // Initialize or add to the total for that date
      groups[date] = (groups[date] || 0) + item.amount;
      setRevenue((prev) => prev + item.amount);
    });

    return {
      arr1: Object.keys(groups), // Array of unique dates
      arr2: Object.values(groups), // Array of summed amounts
    };
  };

  const fetchSales = async () => {
    const access = tokens.get().access; 
    const res = await api.get("/users/role/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (res.status == 200) {
      setVerification(await verifyUser());
    }
    try {
      const response = await api.get("/seller/dashboard/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      console.log(response.data);

      setDashboardData(response.data);
      if (response) {
        console.log(response.data.total_order[0].created_at.slice(0, 10));
        const { arr1, arr2 } = splitobject(response.data.total_order);
        console.log(arr1, arr2);
        setCreatedAt(arr1);
        setAmount(arr2);
      }
    } catch (error) {
      console.log(error);

      return toast.error("Some error occured while fetching", {
        id: "sellerdashboarderror",
      });
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return dashboardData !== null && verification.valid ? (
    <>
      <div className="head">
        <Headers />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen bg-pink-50">
        <aside className="w-full md:w-[15%] text-white flex flex-col items-center md:items-start p-6">
          <div className="w-full flex flex-col gap-4">
            <div className="py-2 text-center rounded bg-pink-400 hover:bg-pink-600 cursor-pointer">
              Dashboard
            </div>

            <div
              className="py-2 text-center rounded bg-pink-400 hover:bg-pink-600 cursor-pointer"
              onClick={() => {
                navigate("/seller/products/");
              }}
            >
              Products Enlisted
            </div>
          </div>
        </aside>

        <main className="w-full md:w-[85%] p-4 md:p-8">
          <div className="flex flex-wrap gap-6 justify-center md:justify-evenly mb-10 text-white">
            <div className="min-w-[220px] p-6 rounded bg-pink-400 shadow shadow-pink-600 flex flex-col items-center font-semibold">
              <span>Total Products Enlisted</span>
              <span className="text-xl">{dashboardData.total_products}</span>
            </div>

            <div className="min-w-[220px] p-6 rounded bg-pink-400 shadow shadow-pink-600 flex flex-col items-center font-semibold">
              <span>Total Orders</span>
              <span className="text-xl">
                {dashboardData.total_order.length}
              </span>
            </div>

            <div className="min-w-[220px] p-6 rounded bg-pink-400 shadow shadow-pink-600 flex flex-col items-center font-semibold">
              <span>Total Revenue</span>
              <span className="text-xl">₹{revenue / 2}</span>
            </div>
          </div>

          <div className="w-full bg-white p-4 rounded shadow">
            {createdAt && amount && (
              <div className="w-full overflow-x-auto">
                <LineChart
                  height={350}
                  width={Math.min(window.innerWidth - 40, 850)}
                  className="bg-pink-100"
                  xAxis={[
                    {
                      data: createdAt,
                      scaleType: "band",
                      valueFormatter: (v) => `Date: ${v}`,
                    },
                  ]}
                  series={[
                    {
                      data: amount,
                      color: "#ff3d5d",
                      valueFormatter: (v) => `₹${v}`,
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  ) : (
    <div className="h-screen w-screen text-xl md:text-3xl text-gray-600 font-bold flex justify-center items-center">
      You are not authorizrd to accesss this page
    </div>
  );
};

export default SellerDashboardPage;
