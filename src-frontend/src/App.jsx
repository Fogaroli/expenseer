import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./page/Navbar";
import Homepage from "./page/Homepage";
import Login from "./page/user/Login";
import Register from "./page/user/Register";
import EditUser from "./page/user/EditUser";
import Categories from "./page/category/Categories";
import Category from "./page/category/Category";
import AddCategory from "./page/category/AddCategory";
import EditCategory from "./page/category/EditCategory";
import Budgets from "./page/budget/Budgets";
import AddBudget from "./page/budget/AddBudget";
import EditBudget from "./page/budget/EditBudget";
import Budget from "./page/budget/Budget";
import Expenses from "./page/expense/Expenses";
import Expense from "./page/expense/Expense";
import EditExpense from "./page/expense/EditExpense";
import AddExpense from "./page/expense/AddExpense";
import Dashboards from "./page/dashboard/Dashboards";
import Indexes from "./page/Indexes/Indexes";
import Layout from "./Layout";
import Error from "./page/Error";

/**Main component, holds the router logic for the multiple menus.
 * In case of no match the navigation should fall back to the homepage.
 */
function App() {
  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<EditUser />} />
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
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/expenses/:id" element={<Expense />} />
          <Route path="/expenses/:id/edit" element={<EditExpense />} />
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/indexes" element={<Indexes />} />
          <Route path="*" element={<Error code="404" />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
