import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import useDashboard from "../customHook/useDashboard";
import { Paper, Typography, Button, Box, Stack, Divider } from "@mui/material";

/** Category component
 *
 * Show a dashboard for the category
 * Should show expenses for current month, history of the last 6 months and the last
 * expenses registered to this category
 */
const Category = () => {
  const { categoryName } = useParams();
  const token = useSelector(selectToken);
  const { currentMonth, history, expenses, isLoading, error } = useDashboard({
    category: categoryName,
  });
  const navigate = useNavigate();

  // Process click to the button to add expense
  // Should send the category name as filter to the add expense component
  const handleAddExpense = () => {
    navigate("/add-expense", {
      state: {
        filters: { category: categoryName },
      },
    });
  };

  // Process clicks to the see all link
  // Should redirect to the expenses components with filters pre-defined
  const handleSeeAll = () => {
    navigate("/expenses", {
      state: {
        filters: { category: categoryName },
      },
    });
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {categoryName}
      </Typography>
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Status</Typography>
      <Typography>
        {currentMonth?.month || ""} - ${currentMonth?.total_amount || ""}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">History (last 6 months)</Typography>
      <Box sx={{ mb: 2 }}>
        {history.map((hist, idx) => (
          <Typography key={idx}>
            {hist.month} - ${hist.total_amount}
          </Typography>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Latest Expenses</Typography>
      <Box sx={{ mb: 2 }}>
        {expenses.map((exp, idx) => (
          <Typography key={idx}>
            {new Date(exp.date).toISOString().split("T")[0]} - {exp.name} - $
            {exp.amount} - {exp.budget}
          </Typography>
        ))}
      </Box>

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button variant="contained" onClick={handleAddExpense}>
          Add new Expense
        </Button>
        <Button variant="outlined" onClick={handleSeeAll}>
          See All
        </Button>
      </Stack>
    </Paper>
  );
};

export default Category;
