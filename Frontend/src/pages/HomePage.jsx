import React, { useState } from "react";
import { useEffect } from "react";
import AsyncApiCall from "../utils/asyncapicall.utils.js";
import api from "../services/api";

const HomePage = () => {
  const Categories = () => {
    let [category, setCategory] = useState(null);
    let [activeMenu, setActiveMenu] = useState(null);
    const activeCategory =
      activeMenu && category
        ? category.find((cat) => cat.id === activeMenu)
        : null;

    function renderCategories(categories) {
      console.log(activeMenu != null ? activeMenu : "sef");

      return categories.map((cat) => (
        <div key={cat.id} className="ml-4">
          <span
            onClick={() => {
              setActiveMenu(cat.id);
            }}
            className="hover:text-pink-600 hover:border-b-4 transition cursor-pointer"
          >
            {cat.name}
          </span>
        </div>
      ));
    }

    useEffect(() => {
      const fetchCategories = async () => {
        const response = await api.get("/products/categories/");

        console.log("category:", response);
        setCategory(response.data);
      };
      fetchCategories();
    }, []);

    return (
      <>
        <div className="flex p-4">
          {category != null ? renderCategories(category) : ""}
        </div>
        {activeMenu != null ? (
          <div>
            {activeCategory && (
              <div>
                {activeCategory.children.map((ele) => (
                  <span key={ele.id}>
                    {ele.name}
                    <br />
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <div className="max-h-screen max-w-screen border">
      <div className="categoryBox">
        <Categories />
      </div>
    </div>
  );
};

export default HomePage;
