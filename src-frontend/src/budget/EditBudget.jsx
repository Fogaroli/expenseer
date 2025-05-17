import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getBudget,
  editBudget,
  clearSuccess,
  clearError,
  deleteBudget,
  selectBudgetError,
  selectBudgetLoading,
  selectUpdateSuccess,
} from "../store/budgetSlice";
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

/** Edit budget Component
 *
 * Allow user to modify information for the budget
 */
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
  const updateSuccess = useSelector(selectUpdateSuccess);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load budget data on render
  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getBudget({ token, name: budgetName })
      ).unwrap();
      setBudgetData(response);
    };
    fetchData();
    return () => {
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [budgetName, dispatch, token]);

  // Form update handler
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

  // Send update request to the server with the information from the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, ...updateData } = budgetData;
    const response = await dispatch(
      editBudget({ token, name, data: updateData })
    ).unwrap();
    if (response) {
      setBudgetData(response);
    }
  };

  // Sends the delete request once the delete button is clicked
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
    return <Navigate to="/" />;
  }
  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        width: { xs: "80vw", sm: 480 },
        maxWidth: "100vw",
        mx: "auto",
        mt: 4,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Budget
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          disabled
          label="Name"
          name="name"
          id="budgetName"
          value={budgetData.name}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Amount"
          name="amount"
          id="budgetAmount"
          type="number"
          value={budgetData.amount || 0}
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
          {/* <MenuItem value={2}>Yearly Expense</MenuItem>
          <MenuItem value={3}>Event</MenuItem>
          <MenuItem value={4}>Savings</MenuItem> */}
        </TextField>
        <TextField
          label="Description"
          name="description"
          id="budgetDescription"
          value={budgetData.description || ""}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          sx={{ mb: 2 }}
        />
        {updateSuccess && (
          <Typography color="success" sx={{ mt: 2 }}>
            Update Successful
          </Typography>
        )}
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
            Update Budget
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete Budget
          </Button>
        </Stack>
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};
export default Editbudget;
