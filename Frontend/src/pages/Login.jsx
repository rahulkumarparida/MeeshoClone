import { useState } from "react";
import { loginUser } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { setUser, setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    //   const res = await loginUser({ email, password });

    const req = {
        email: email,
        password: password,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Login failed:", res.status, text);
        return;
      }

      const response = await res.json();
      console.log("response", response);
      // setUser(response.data.user);
      // setToken(response.data.access);
    } catch (err) {
      console.error("Network or other error", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-sm mx-auto">
      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-black text-white px-4 py-2 w-full">
        Login
      </button>
    </form>
  );
}
