import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import Login from "./user/Login";
import Register from "./user/Register";
import Categories from "./expenses/Categories";
import Category from "./expenses/Category";
import AddCategory from "./expenses/AddCategory";
import EditCategory from "./expenses/EditCategory";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/categories/:categoryName" element={<Category />} />
        <Route
          path="/categories/:categoryName/edit"
          element={<EditCategory />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
