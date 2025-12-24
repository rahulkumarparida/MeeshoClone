import React from "react";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  let { setUser, tokenStorage } = useAuth();

  {
    if (tokenStorage.exists()) {
      return (
        <div>
          HomePage
          <p>{tokenStorage.get().refresh}</p>
        </div>
      );
    }else{
        return <div>
            Login First
        </div>
    }
  }
};

export default HomePage;
