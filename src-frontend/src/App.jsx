import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import Login from "./user/Login";
import Register from "./user/Register";
import Categories from "./category/Categories";
import Category from "./category/Category";
import AddCategory from "./category/AddCategory";
import EditCategory from "./category/EditCategory";
import Budgets from "./budget/Budgets";
import AddBudget from "./budget/AddBudget";
import EditBudget from "./budget/EditBudget";
import Budget from "./budget/Budget";

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
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/add-budget" element={<AddBudget />} />
        <Route path="/budgets/:budgetName/edit" element={<EditBudget />} />
        <Route path="/budgets/:budgetName" element={<Budget />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
