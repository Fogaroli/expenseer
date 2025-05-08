import { useState } from "react";
import {
  addBudget,
  selectBudgetError,
  selectBudgetLoading,
} from "../store/budgetSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { selectToken } from "../store/authSlice";

/** Add Budget component
 *
 * Allows user to add a new expense budget to its list
 */
const AddBudget = () => {
  const initialState = {
    name: "",
    type: 0,
    amount: 0,
    description: "",
  };
  const [budgetData, setBudgetData] = useState(initialState);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const error = useSelector(selectBudgetError);
  const loading = useSelector(selectBudgetLoading);
  const navigate = useNavigate();

  // Send new budget data to the server once click submit
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await dispatch(addBudget({ token, data: budgetData })).unwrap();
      setBudgetData(initialState);
      navigate("/budgets");
    } catch (err) {
      console.error("Failed to add Budget: ", err);
    }
  };

  // Form update handler
  const handleChange = (evt) => {
    let { name, value } = evt.target;
    // Convert amount to number if it's a number input
    if (name === "amount" || name === "type") {
      value = parseFloat(value);
    }
    setBudgetData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <h1>Add Budget</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
        <div>
          <label htmlFor="budgetName">Name</label>
          <input
            type="text"
            name="name"
            id="budgetName"
            aria-describedby="Budget Name"
            value={budgetData.name}
            onChange={handleChange}
          />
          <label htmlFor="budgetAmount">Amount</label>
          <input
            type="number"
            name="amount"
            id="budgetAmount"
            aria-describedby="Budget Amount"
            value={budgetData.amount}
            onChange={handleChange}
          />
          <label htmlFor="budgetType">Type</label>
          <select
            name="type"
            id="budgetType"
            aria-describedby="Budget Type"
            value={budgetData.type}
            onChange={handleChange}
          >
            <option value="0">Select a type</option>
            <option value="1">Monthly Expense</option>
            <option value="2">Yearly Expense</option>
            <option value="3">Event</option>
            <option value="4">Savings</option>
          </select>
          <label htmlFor="budgetDescription">Description</label>
          <textarea
            name="description"
            id="budgetDescription"
            aria-describedby="Budget Description"
            value={budgetData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Budget</button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
};

export default AddBudget;
