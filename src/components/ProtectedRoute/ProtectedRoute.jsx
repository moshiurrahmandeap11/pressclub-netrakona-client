import React, { useState } from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // localStorage থেকে আগের auth চেক করবো
    const savedAuth = localStorage.getItem("pc_admin_auth");
    return savedAuth === "true";
  });

  if (!isAuthenticated) {
    // login form দেখাবে
    return <LoginForm setIsAuthenticated={setIsAuthenticated} />;
  }

  // যদি logged in থাকে, তাহলে protected component দেখাবে
  return children;
};

const LoginForm = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin@pc.com" && password === "pcadminlogin@#01") {
      localStorage.setItem("pc_admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setError("❌ Username বা Password ভুল!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">🔐 Admin Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default ProtectedRoute;
