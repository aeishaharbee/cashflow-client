import TopNav from "./components/navbar/TopNav";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Expense from "./pages/Expense";
import Budget from "./pages/Budget";

function App() {
  const [token, setToken] = useState(Cookies.get("authToken") || "");

  return (
    <>
      <TopNav token={token} setToken={setToken} />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/budgets" element={<Budget />} />
      </Routes>
    </>
  );
}

export default App;
