import  { useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Protect routes
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  // Handle login and redirect
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/form");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/form"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={() => navigate("/form")}
                    className="px-6 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-600 text-white"
                  >
                    Form
                  </button>
                  <button
                    onClick={() => navigate("/table")}
                    className="px-6 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-700 hover:bg-gray-600 text-gray-300"
                  >
                    Table
                  </button>
                </div>
                <div className="w-full mx-auto">
                  <Form />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/table"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white shadow-md hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={() => navigate("/form")}
                    className="px-6 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 hover:bg-gray-600 text-gray-300"
                  >
                    Form
                  </button>
                  <button
                    onClick={() => navigate("/table")}
                    className="px-6 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-600 text-white"
                  >
                    Table
                  </button>
                </div>
                <div className="w-full mx-auto">
                  <Table />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

