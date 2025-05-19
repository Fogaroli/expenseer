import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/authSlice";
import useDashboard from "../../customHook/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Paper,
  Typography,
  Button,
  Box,
  Stack,
  Divider,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

/** Budget component
 *
 * Show a dashboard for the budget
 * Should show expenses for current month, history of the last 6 months and the last
 * expenses registered to this budget
 */
const Budget = () => {
  const { budgetName } = useParams();
  const token = useSelector(selectToken);
  const { currentMonth, history, expenses, isLoading, error } = useDashboard({
    budget: budgetName,
  });
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up("sm"));

  // Process click to the button to add expense
  // Should send the budget name as filter to the add expense component
  const handleAddExpense = () => {
    navigate("/add-expense", {
      state: {
        filters: { budget: budgetName },
      },
    });
  };

  // Process clicks to the see all link
  // Should redirect to the expenses components with filters pre-defined
  const handleSeeAll = () => {
    navigate("/expenses", {
      state: {
        filters: { budget: budgetName },
      },
    });
  };

  // Process the historical data to split among what is withing the budget and what is outside the budget.
  // Note the usage of the current active budget as there is no budget threshold history
  const processedHistory = history
    ? history.map((item) => {
        const budget = Number(item.budget_amount) || 0;
        const total = Number(item.total_amount) || 0;
        return {
          ...item,
          withinBudget: Math.min(total, budget),
          overBudget: total > budget ? total - budget : 0,
        };
      })
    : [];

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
      <Typography variant="h4" gutterBottom>
        {budgetName}
      </Typography>
      <Typography>Budget Value ${currentMonth?.budget_amount || 0}</Typography>
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Status</Typography>

      <Box sx={{ mb: 2 }}>
        <Typography>
          {currentMonth?.month || ""} - ${currentMonth?.total_amount || ""}
        </Typography>
        <Box sx={{ width: "100%", mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(Number(currentMonth?.percent_used) || 0, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor:
                  Number(currentMonth?.percent_used) > 90
                    ? "#d32f2f"
                    : "#1976d2",
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {currentMonth?.percent_used || 0}% used
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Last 6 Months</Typography>
      <Box sx={{ mb: 2, width: "100%", height: 250 }}>
        {processedHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="withinBudget"
                stackId="a"
                fill="#1976d2"
                name="Within Budget"
              />
              <Bar
                dataKey="overBudget"
                stackId="a"
                fill="#d32f2f"
                name="Over Budget"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No history data available.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Latest Expenses</Typography>

      <Box sx={{ mb: 2 }}>
        {expenses.map((exp, idx) => (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <Typography
              key={idx}
              sx={{
                flexBasis: { xs: "30%", sm: "20%" },
                flexShrink: 0,
              }}
            >
              {new Date(exp.date).toISOString().split("T")[0]}
            </Typography>
            <Typography
              key={idx}
              sx={{
                flexBasis: { xs: "50%", sm: "40%" },
                flexShrink: 0,
              }}
            >
              {exp.name}
            </Typography>
            <Typography
              key={idx}
              sx={{
                flexBasis: { xs: "20%", sm: "20%" },
                flexShrink: 0,
              }}
            >
              ${exp.amount}
            </Typography>
            {isMobile && (
              <Typography
                key={idx}
                sx={{
                  flexBasis: "20%",
                  flexShrink: 0,
                }}
              >
                {exp.category}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button fullWidth variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button fullWidth variant="contained" onClick={handleAddExpense}>
          Add new Expense
        </Button>
        <Button fullWidth variant="outlined" onClick={handleSeeAll}>
          See All
        </Button>
      </Stack>
    </Paper>
  );
};

export default Budget;
