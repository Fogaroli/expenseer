import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import {
  getBudgets,
  selectBudgets,
  selectBudgetLoading,
  selectBudgetError,
} from "../store/budgetSlice";
import {
  getCategories,
  selectCategories,
  selectCategoryError,
  selectCategoryLoading,
} from "../store/categorySlice";

/** Add Expense Component
 *
 * Should allow user to add a new expense to the database.
 * The page that redirects to this component might send pre-selected filters as
 * location state, so enhance user experience.
 */
const AddExpense = () => {
  //recover data sent from previous rendered component
  const location = useLocation();
  const filters = location.state?.filters;

  const INITIALEXPENSEDATA = {
    name: "",
    amount: 0,
    description: "",
    date: new Date().toLocaleDateString("en-CA"),
    budget: filters?.budget || "",
    category: filters?.category || "",
  };
  const [newExpense, setNewExpense] = useState(INITIALEXPENSEDATA);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector(selectToken);
  const categories = useSelector(selectCategories);
  const budgets = useSelector(selectBudgets);
  const categoryLoading = useSelector(selectCategoryLoading);
  const categoryError = useSelector(selectCategoryError);
  const budgetLoading = useSelector(selectBudgetLoading);
  const budgetError = useSelector(selectBudgetError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read categories and budgets in case data not available in Redux store to populate filter input
  useEffect(() => {
    if (token && budgets.length === 0) {
      dispatch(getBudgets(token));
    }
    if (token && categories.length === 0) {
      dispatch(getCategories(token));
    }
  }, [token, budgets.length, categories.length, dispatch]);

  // Form update handler
  const handleChange = (evt) => {
    let { name, value } = evt.target;
    if (name === "amount") {
      value = parseFloat(value);
    }
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  // Send new expense data to the server
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      const response = await ExpenseerAPI.addExpense(newExpense);
      if (!response) {
        throw new Error("Error registering expense");
      }
      Object.keys(response).forEach((key) =>
        response[key] === null ? (response[key] = "") : response[key]
      );
      setNewExpense(response);
      navigate("/expenses");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h1>Register New Expense</h1>
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newExpense.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={newExpense.amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            id="category"
            aria-describedby="Category"
            value={newExpense.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {categoryLoading && (
            <p>
              <FontAwesomeIcon icon={faCircleNotch} spin />
            </p>
          )}
          {categoryError && <p style={{ color: "red" }}>{categoryError}</p>}
        </div>
        <div>
          <label htmlFor="budget">Budget:</label>
          <select
            name="budget"
            id="budget"
            aria-describedby="Budget"
            value={newExpense.budget}
            onChange={handleChange}
          >
            <option value="">Select Budget</option>
            {budgets.map((bud, idx) => (
              <option key={idx} value={bud.name}>
                {bud.name}
              </option>
            ))}
          </select>
          {budgetLoading && (
            <p>
              <FontAwesomeIcon icon={faCircleNotch} spin />
            </p>
          )}
          {budgetError && <p style={{ color: "red" }}>{budgetError}</p>}
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={newExpense.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={newExpense.description}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};
export default AddExpense;
