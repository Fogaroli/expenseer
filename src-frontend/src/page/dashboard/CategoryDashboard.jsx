import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/authSlice";
import ExpenseerAPI from "../../helper/api";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

/** Category Dashboard component
 *
 * Should indicate the total monthly expenses for each category.
 */
const CategoryDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(selectToken);

  // Load dashboard data on render
  useEffect(() => {
    const getCategoryDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        ExpenseerAPI.token = token;
        const response = await ExpenseerAPI.getExpenseDashboard("category");
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
    getCategoryDashboardData();
  }, [token]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Expenses by Category
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
          {dashboardData.map((category, idx) => (
            <ListItem key={idx} disablePadding>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  px: 2,
                  py: 1,
                }}
              >
                <Typography
                  component={Link}
                  to={`/categories/${category.category}`}
                  variant="body1"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  {category.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  $ {category.total_amount}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default CategoryDashboard;
