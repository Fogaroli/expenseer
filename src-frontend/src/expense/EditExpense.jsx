import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
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
import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";

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
  const navigate = useNavigate();

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
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Edit Expense
      </Typography>
      {loading && <CircularProgress sx={{ mb: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {expense && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={expense.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={expense.amount || 0}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Category"
            name="category"
            value={expense.category}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={categoryLoading}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          {categoryLoading && <CircularProgress size={20} sx={{ mb: 2 }} />}
          {categoryError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {categoryError}
            </Typography>
          )}
          <TextField
            select
            label="Budget"
            name="budget"
            value={expense.budget}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            disabled={budgetLoading}
          >
            <MenuItem value="">Select Budget</MenuItem>
            {budgets.map((bud, idx) => (
              <MenuItem key={idx} value={bud.name}>
                {bud.name}
              </MenuItem>
            ))}
          </TextField>
          {budgetLoading && <CircularProgress size={20} sx={{ mb: 2 }} />}
          {budgetError && (
            <Typography color="error" sx={{ mb: 2 }}>
              {budgetError}
            </Typography>
          )}
          <TextField
            label="Date"
            name="date"
            type="date"
            value={expense.date}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={expense.description || ""}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button fullWidth variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Stack>
        </Box>
      )}
    </Paper>
  );
};
export default EditExpense;
