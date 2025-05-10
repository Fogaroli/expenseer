import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import { Navigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Box,
} from "@mui/material";

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
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Expense Details
      </Typography>
      {loading && <CircularProgress sx={{ mb: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {expense && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">{expense.name}</Typography>
          <Typography>Amount: € {expense.amount}</Typography>
          <Typography>
            Date: {new Date(expense.date).toISOString().split("T")[0]}
          </Typography>
          <Typography>Category: {expense.category}</Typography>
          <Typography>Budget: {expense.budget}</Typography>
          <Typography>Description: {expense.description}</Typography>
        </Box>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button fullWidth variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => navigate(`/expenses/${id}/edit`)}
        >
          Edit
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </Button>
      </Stack>
    </Paper>
  );
};

export default Expense;
