import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getBudget,
  editBudget,
  deleteBudget,
  selectBudgetError,
  selectBudgetLoading,
} from "../store/budgetSlice";
import { selectToken } from "../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Editbudget = () => {
  const initialState = {
    name: "",
    type: 0,
    amount: 0,
    description: "",
  };
  const { budgetName } = useParams();
  const [budgetData, setBudgetData] = useState(initialState);
  const loading = useSelector(selectBudgetLoading);
  const error = useSelector(selectBudgetError);
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getBudget({ token, name: budgetName })
      ).unwrap();
      setBudgetData(response);
    };
    fetchData();
  }, [budgetName, dispatch, token]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    // Convert amount to number if it's a number input
    if (name === "amount" || name === "type") {
      value = parseFloat(value);
    }
    setBudgetData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      editBudget({ token, name: budgetName, data: budgetData })
    ).unwrap();
    if (response) {
      setBudgetData(response);
    }
  };

  const handleDelete = async (evt) => {
    evt.preventDefault();
    const response = await dispatch(
      deleteBudget({ token, name: budgetName })
    ).unwrap();
    if (response) {
      navigate("/budgets");
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Edit Budget</h1>
      {loading && (
        <p>
          Loading <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
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
            value={budgetData.description || ""}
            onChange={handleChange}
          />
        </div>
        <Link to={`/budgets`}>Return</Link>
        <button type="submit">Update budget</button>
        <button type="button" onClick={handleDelete}>
          Delete Budget
        </button>
      </form>
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
};
export default Editbudget;
