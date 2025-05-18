import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import BudgetDashboard from "./BudgetsDashboard";
import CategoryDashboard from "./CategoryDashboard";
import {
  Paper,
  Box,
  IconButton,
  Button,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSwipeable } from "react-swipeable";

const dashboards = [<BudgetDashboard />, <CategoryDashboard />];

const Dashboards = () => {
  const [showing, setShowing] = useState(0);
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const prev = () =>
    setShowing((c) => (c === 0 ? dashboards.length - 1 : c - 1));
  const next = () =>
    setShowing((c) => (c === dashboards.length - 1 ? 0 : c + 1));

  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

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
        width: { xs: "80vw", md: 720 },
        maxWidth: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Left arrow - visible only on desktop */}
        {!isMobile && (
          <IconButton onClick={prev} aria-label="Previous" sx={{ mr: 1 }}>
            <ArrowBackIosIcon />
          </IconButton>
        )}

        <Paper
          {...handlers}
          elevation={4}
          sx={{
            p: { xs: 2, sm: 4 },
            width: "100%",
            maxWidth: 500,
            overflow: "hidden",
            boxSizing: "border-box",
            position: "relative",
            touchAction: "pan-y",
          }}
        >
          <Box sx={{ textAlign: "center", width: "100%" }}>
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

        {/* Right arrow - visible only on desktop */}
        {!isMobile && (
          <IconButton onClick={next} aria-label="Next" sx={{ ml: 1 }}>
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>

      {/* Pagination dots */}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {dashboards.map((_, index) => (
          <Box
            key={index}
            onClick={() => setShowing(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: index === showing ? "primary.main" : "grey.400",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboards;
