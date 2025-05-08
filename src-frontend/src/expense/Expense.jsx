import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

/** Expense component
 *
 * Shows de details of a given expense.
 * Expense if provided as url parameter
 *
 * Should show buttons to editing or deleting the expense.
 */
const Expense = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  // Load expense data on render.
  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpense(id);
        if (!response) {
          throw new Error("Error retrieving expense");
        }
        setExpense(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id, token]);

  // Process button click to delete expense
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      ExpenseerAPI.token = token;
      const response = await ExpenseerAPI.deleteExpense(id);
      if (!response) {
        throw new Error("Error deleting expense");
      }
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

  if (!id) {
    return <Navigate to="/expenses" />;
  }

  return (
    <>
      Expense Details
      {loading && (
        <p>
          <FontAwesomeIcon icon={faCircleNotch} spin />
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {expense && (
        <div>
          <h2>{expense.name}</h2>
          <p>Amount: € {expense.amount}</p>
          <p>Date: {new Date(expense.date).toISOString().split("T")[0]}</p>
          <p>Category: {expense.category}</p>
          <p>Budget: {expense.budget}</p>
          <p>Description: {expense.description}</p>
        </div>
      )}
      <button onClick={() => window.history.back()}>Back</button>
      <button onClick={() => navigate(`/expenses/${id}/edit`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </>
  );
};

export default Expense;
