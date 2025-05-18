import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import BudgetDashboard from "./BudgetsDashboard";
import CategoryDashboard from "./CategoryDashboard";
import { Paper, Box, IconButton, Stack, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const dashboards = [<BudgetDashboard />, <CategoryDashboard />];

/** Dashboard component
 * Should provide access to dashboards for categories or budgets in a carousel
 */
const Dashboards = () => {
  const [showing, setShowing] = useState(0);
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const prev = () =>
    setShowing((c) => (c === 0 ? dashboards.length - 1 : c - 1));
  const next = () =>
    setShowing((c) => (c === dashboards.length - 1 ? 0 : c + 1));

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        width: "100%",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          minWidth: { xs: "0", sm: 350 },
          maxWidth: { xs: "100%", sm: 500 },
          overflow: "hidden",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ width: "100%", textAlign: "center" }}>
          {dashboards[showing]}
        </Box>
        <Button
          variant="contained"
          sx={{ mt: 3, width: "100%" }}
          onClick={() => navigate("/add-expense")}
        >
          Add new Expense
        </Button>
      </Paper>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <IconButton
          onClick={prev}
          sx={{
            bgcolor: "background.paper",
          }}
          aria-label="Previous"
        >
          <ArrowBackIosIcon />
        </IconButton>
        <IconButton
          onClick={next}
          sx={{
            bgcolor: "background.paper",
          }}
          aria-label="Next"
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Dashboards;
