import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./store/authSlice";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";

/** Homepage content
 * Shows app info and login/signup links for new users.
 * Registered users are redirected to dashboards.
 */
const Homepage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) navigate("/dashboards");
  }, [user, navigate]);

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 480,
          width: "100%",
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Expenseer
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Take control of your finances with ease.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Expenseer helps you track your spending, manage budgets, and reach
          your financial goals. Sign up to get started or log in if you already
          have an account.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Homepage;
