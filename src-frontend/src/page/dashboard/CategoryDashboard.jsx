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
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Function to generate colors for the pie chart
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

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
        const response = await ExpenseerAPI.getSummaryDashboard("categories");
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

  const colors = dashboardData ? generateColors(dashboardData.length) : [];

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
        <>
          <Box sx={{ height: 300, mb: 2 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dashboardData}
                  dataKey="total_amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {dashboardData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <List>
            {dashboardData.map((category, idx) => (
              <ListItem key={idx} disablePadding>
                <Box
                  component={Link}
                  to={`/categories/${category.category}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    px: 2,
                    py: 1,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: colors[idx],
                        borderRadius: "4px",
                        marginRight: 1,
                      }}
                    />
                    <Typography variant="body1">{category.category}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    $ {category.total_amount}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};

export default CategoryDashboard;
