import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/authSlice";
import ExpenseerAPI from "../../helper/api";
import {
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  Box,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
        const response = await ExpenseerAPI.getSummaryDashboard("budgets");
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

  // Budget types are defined by number, here they should be translated to show to the user.
  const budgetTypeLabels = {
    1: "Monthly",
    2: "Yearly",
    3: "Event",
    4: "Savings",
  };

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
          {dashboardData.map((budget, idx) => {
            const percent = Math.min(Number(budget.percent_used || 0), 100);
            const isOverBudget = budget.percent_used > 100;
            const barColor = isOverBudget
              ? "#d32f2f"
              : percent > 90
              ? "#d32f2f"
              : "#1976d2";

            const pieData = isOverBudget
              ? [{ value: 100, color: "#d32f2f" }]
              : [
                  { value: percent, color: barColor },
                  { value: 100 - percent, color: "#e0e0e0" },
                ];

            return (
              <ListItem
                key={idx}
                component={Link}
                to={`/budgets/${budget.budget}`}
                disablePadding
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  {budget.budget}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ flex: 1, pr: 2, minWidth: "50%" }}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {budgetTypeLabels[budget.type] || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {+budget.percent_used}%{" "}
                      {budget.type === 4 ? "achieved" : "used"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      <strong>{budget.type === 4 ? "Goal" : "Budget"}:</strong>{" "}
                      ${budget.budget_amount || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ width: 100, height: 100 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={40}
                          startAngle={90}
                          endAngle={-270}
                          paddingAngle={2}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default BudgetDashboard;
