import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import Login from "./user/Login";
import Register from "./user/Register";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
