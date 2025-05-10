import { useState } from "react";
import {
  addBudget,
  selectBudgetError,
  selectBudgetLoading,
} from "../store/budgetSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { selectToken } from "../store/authSlice";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  MenuItem,
} from "@mui/material";

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
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Budget
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          id="budgetName"
          value={budgetData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Amount"
          name="amount"
          id="budgetAmount"
          type="number"
          value={budgetData.amount}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Type"
          name="type"
          id="budgetType"
          select
          value={budgetData.type}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          <MenuItem value={0}>Select a type</MenuItem>
          <MenuItem value={1}>Monthly Expense</MenuItem>
          <MenuItem value={2}>Yearly Expense</MenuItem>
          <MenuItem value={3}>Event</MenuItem>
          <MenuItem value={4}>Savings</MenuItem>
        </TextField>
        <TextField
          label="Description"
          name="description"
          id="budgetDescription"
          value={budgetData.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            Add Budget
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Stack>
        {loading && <Typography sx={{ mt: 2 }}>Loading...</Typography>}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default AddBudget;
