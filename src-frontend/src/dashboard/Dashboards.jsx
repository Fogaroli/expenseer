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
  const [hover, setHover] = useState(false);
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
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          minWidth: 350,
          maxWidth: 500,
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Stack direction="row" alignItems="center" justifyContent="center">
          {hover && (
            <IconButton
              onClick={prev}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "background.paper",
                ":hover": { bgcolor: "grey.200" },
              }}
              aria-label="Previous"
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}
          <Box sx={{ width: "100%", textAlign: "center" }}>
            {dashboards[showing]}
          </Box>
          {hover && (
            <IconButton
              onClick={next}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                bgcolor: "background.paper",
                ":hover": { bgcolor: "grey.200" },
              }}
              aria-label="Next"
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Stack>
        <Button
          variant="contained"
          sx={{ mt: 3, width: "100%" }}
          onClick={() => navigate("/add-expense")}
        >
          Add new Expense
        </Button>
      </Paper>
    </Box>
  );
};

export default Dashboards;
