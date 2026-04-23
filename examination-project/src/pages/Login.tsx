import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/Auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  useAuth();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");

          try {
            const data = await login({ email, password });

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            setUser(data.user);
            navigate("/");
          } catch (err) {
            const errorMessage = (err as any).response?.data?.message || "Login failed";
            setError(errorMessage);
          }
        }}
        className="w-full max-w-sm space-y-4 border p-6 rounded"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
