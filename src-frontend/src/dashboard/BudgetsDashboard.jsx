import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import ExpenseerAPI from "../helper/api";
import {
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Box,
} from "@mui/material";

/** Budget Dashboard component
 *
 * Should indicate the total monthly expenses for each Budget.
 */
const BudgetDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  // Load dashboard data on render
  useEffect(() => {
    const getBudgetDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpenseDashboard("budget");
        if (!response) {
          throw new Error("Error retrieving dashboard");
        }
        setDashboardData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBudgetDashboardData();
  }, [token]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Expenses by Budget
      </Typography>
      {loading && (
        <Typography align="center" sx={{ my: 2 }}>
          <CircularProgress size={24} />
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}
      {dashboardData && (
        <List>
          {dashboardData && (
            <List>
              {dashboardData.map((budget, idx) => {
                const percent = Math.min(Number(budget.percentage_used), 100);
                const barColor = percent > 90 ? "#d32f2f" : "#1976d2"; // error or primary

                return (
                  <ListItem
                    key={idx}
                    disablePadding
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        component={Link}
                        to={`/budgets/${budget.budget}`}
                        variant="body1"
                        sx={{ textDecoration: "none", color: "inherit" }}
                      >
                        {budget.budget}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Spent:</strong> {budget.total_amount} /{" "}
                        <strong>Budget:</strong> {budget.budget_amount}
                      </Typography>
                    </Box>
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={+budget.percent_used}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: barColor,
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {+budget.percent_used}% used
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          )}
        </List>
      )}
    </Paper>
  );
};

export default BudgetDashboard;
