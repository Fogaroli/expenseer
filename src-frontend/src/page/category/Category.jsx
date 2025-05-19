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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up("sm"));

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
    <Paper
      elevation={4}
      sx={{
        p: 1,
        width: { xs: "80vw", md: 765 },
        maxWidth: "100vw",
        mx: "auto",
        mt: 4,
        boxSizing: "border-box",
      }}
    >
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
      <Box sx={{ mb: 2, width: "100%", height: 250 }}>
        {history && history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_amount" fill="#1976d2" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No history data available.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Latest Expenses</Typography>
      <Box>
        {expenses.map((exp, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 2,
              display: "flex",
              width: "100%",
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                flexBasis: { xs: "30%", sm: "20%" },
                flexShrink: 0,
              }}
            >
              {new Date(exp.date).toISOString().split("T")[0]}
            </Typography>
            <Typography
              sx={{
                flexBasis: { xs: "50%", sm: "45%" },
                flexShrink: 0,
              }}
            >
              {exp.name}
            </Typography>
            <Typography
              sx={{
                flexBasis: { xs: "20%", sm: "15%" },
                flexShrink: 0,
              }}
            >
              ${exp.amount}
            </Typography>
            {isMobile && (
              <Typography
                sx={{
                  flexBasis: "20%",
                  flexShrink: 0,
                }}
              >
                {exp.budget}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
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

export default Category;
