import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
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
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            textAlign: "center",
          }}
          gutterBottom
        >
          Welcome to Expenseer
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Take control of your finances.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: "left" }}>
          Expenseer was designed to help you track your spending, manage
          budgets, and reach your financial goals. <br />
          <br /> Use to tool to create financial budgets and set expense
          targets. Keep it handy and record every step, save every expense
          detail to the tool, assigning a budget and a expense category.
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: "left" }}>
          Use the Dashboards and the expense detailed information to access
          current status and a history of the budget performance in previous
          months.
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
