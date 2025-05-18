import { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
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
  InputAdornment,
} from "@mui/material";

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
    <Paper
      elevation={4}
      sx={{
        p: 2,
        width: { xs: "80vw", md: 765 },
        maxWidth: "100vw",
        mx: "auto",
        mt: 4,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Register New Expense
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={newExpense.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={newExpense.amount || ""}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          inputProps={{
            step: "0.01",
            min: "0",
          }}
        />
        <TextField
          select
          label="Category"
          name="category"
          value={newExpense.category}
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
          value={newExpense.budget}
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
          value={newExpense.date}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          value={newExpense.description}
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
            {loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </Stack>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
export default AddExpense;
