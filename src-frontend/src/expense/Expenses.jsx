import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import {
  getBudgets,
  selectBudgets,
  selectBudgetLoading,
  selectBudgetError,
} from "../store/budgetSlice";
import { selectToken } from "../store/authSlice";
import {
  getCategories,
  selectCategories,
  selectCategoryError,
  selectCategoryLoading,
} from "../store/categorySlice";
import ExpenseerAPI from "../helper/api";
import ExpenseItem from "./ExpenseItem";
import {
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const LIMIT = 20;

/** Expenses components
 *
 * Should show all user expenses with associated category and budget.
 * It should be possible to filter hte results using the form inputs provided.
 *
 * Expenses list implements infinite scrolling
 */
const Espenses = () => {
  const location = useLocation();
  const filters = location.state?.filters;
  const INITIALFILTERS = {
    category: filters?.category || "",
    budget: filters?.budget || "",
    startdate: "",
    enddate: "",
  };
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldsData, setFieldData] = useState(INITIALFILTERS);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const categories = useSelector(selectCategories);
  const budgets = useSelector(selectBudgets);
  const categoryLoading = useSelector(selectCategoryLoading);
  const categoryError = useSelector(selectCategoryError);
  const budgetLoading = useSelector(selectBudgetLoading);
  const budgetError = useSelector(selectBudgetError);
  const token = useSelector(selectToken);
  const observer = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Resets expenses list on page refresh or when filters are updated
  useEffect(() => {
    setExpenses([]);
    setOffset(0);
    setHasMore(true);
  }, [fieldsData, token]);

  // Triggers function to get expenses on first render and when filter data is modified
  useEffect(() => {
    const getExpenses = async (filters) => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpenses(filters);
        if (!response) {
          throw new Error("Error retrieving expenses");
        }
        setExpenses((prev) =>
          offset === 0 ? response : [...prev, ...response]
        );
        setHasMore(response.length === LIMIT);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const filters = { limit: LIMIT, offset };
    fieldsData.category === ""
      ? null
      : (filters.category = fieldsData.category);
    fieldsData.budget === "" ? null : (filters.budget = fieldsData.budget);
    fieldsData.startdate === ""
      ? null
      : (filters.start_date = fieldsData.startdate);
    fieldsData.enddate === "" ? null : (filters.end_date = fieldsData.enddate);

    getExpenses(filters);
  }, [fieldsData, token, offset]);

  // Updates what is the last refence in the list to control infinite scrolling
  const lastExpenseRef = useCallback(
    (last) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prev) => prev + LIMIT);
        }
      });
      if (last) observer.current.observe(last);
    },
    [loading, hasMore]
  );

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
    setFieldData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  // Handle button click to add a new expense
  // Current filters are transfered to the new expense component
  const handleAddExpense = () => {
    navigate("/add-expense", {
      state: {
        filters: { category: fieldsData.category, budget: fieldsData.budget },
      },
    });
  };

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 1100,
        width: "100%",
        mx: "auto",
        mt: 4,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Expenses
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <TextField
            select
            label="Category"
            name="category"
            value={fieldsData.category}
            onChange={handleChange}
            sx={{
              minWidth: { xs: 0, sm: 160 },
              width: { xs: "100%", sm: "auto" },
            }}
            disabled={categoryLoading}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Budget"
            name="budget"
            value={fieldsData.budget}
            onChange={handleChange}
            sx={{
              minWidth: { xs: 0, sm: 160 },
              width: { xs: "100%", sm: "auto" },
            }}
            disabled={budgetLoading}
          >
            <MenuItem value="">Select Budget</MenuItem>
            {budgets.map((bud, idx) => (
              <MenuItem key={idx} value={bud.name}>
                {bud.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start Date"
            name="startdate"
            type="date"
            value={fieldsData.startdate}
            onChange={handleChange}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              minWidth: { xs: 0, sm: 140 },
              width: { xs: "100%", sm: "auto" },
            }}
          />
          <TextField
            label="End Date"
            name="enddate"
            type="date"
            value={fieldsData.enddate}
            onChange={handleChange}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              minWidth: { xs: 0, sm: 140 },
              width: { xs: "100%", sm: "auto" },
            }}
          />
          <Button
            variant="outlined"
            onClick={() => setFieldData(INITIALFILTERS)}
            sx={{ height: 56 }}
          >
            Clear Filters
          </Button>
        </Stack>
        {categoryLoading && <CircularProgress size={20} sx={{ mr: 2 }} />}
        {categoryError && (
          <Typography color="error" sx={{ mr: 2 }}>
            {categoryError}
          </Typography>
        )}
        {budgetLoading && <CircularProgress size={20} sx={{ mr: 2 }} />}
        {budgetError && (
          <Typography color="error" sx={{ mr: 2 }}>
            {budgetError}
          </Typography>
        )}
      </Box>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">List of expenses</Typography>
        <Button variant="contained" onClick={handleAddExpense}>
          Add new Expense
        </Button>
      </Stack>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box>
        {expenses.map((exp, idx) => {
          if (idx === expenses.length - 1) {
            return (
              <ExpenseItem
                key={exp.id || idx}
                expense={exp}
                ref={lastExpenseRef}
              />
            );
          }
          return <ExpenseItem key={exp.id || idx} expense={exp} />;
        })}
      </Box>
      {loading && (
        <CircularProgress sx={{ display: "block", mx: "auto", mb: 2 }} />
      )}
      {expenses.length === 0 && !loading && !error && (
        <Typography>No expenses found</Typography>
      )}
    </Paper>
  );
};
export default Espenses;
