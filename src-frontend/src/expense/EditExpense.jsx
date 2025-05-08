import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
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

/** Edit expense component
 *
 * Should allow user to modify the information associated to each expense
 */
const EditExpense = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
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

  // Load expense information on first render to populate form
  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      setError([]);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpense(id);
        if (!response) {
          throw new Error("Error retrieving expense");
        }
        Object.keys(response).forEach((key) =>
          response[key] === null ? (response[key] = "") : response[key]
        );
        setExpense(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id, token]);

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
    // Convert amount to number if it's a number input
    if (name === "amount") {
      value = parseFloat(value);
    }
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  // Handle form submission to save changes to the database
  // Fields empty will be translated to null by the server during response
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      const { id, ...expenseData } = expense;
      const response = await ExpenseerAPI.editExpense(id, expenseData);
      if (!response) {
        throw new Error("Error updating expense");
      }
      Object.keys(response).forEach((key) =>
        response[key] === null ? (response[key] = "") : response[key]
      );
      setExpense(response);
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
      <h1>Edit Expense</h1>
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {expense && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={expense.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              aria-describedby="Category"
              value={expense.category}
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
              value={expense.budget}
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
              value={expense.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={expense.description || ""}
              onChange={handleChange}
            />
          </div>
          <button type="button" onClick={() => window.history.back()}>
            Back
          </button>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};
export default EditExpense;
