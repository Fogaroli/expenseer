import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/authSlice";
import Stocks from "./Stocks";
import Exchanges from "./Exchanges";
import {
  Paper,
  Box,
  IconButton,
  Stack,
  Button,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { useSwipeable } from "react-swipeable";

const indexes = [<Stocks />, <Exchanges />];

/** Main Indexes component
 * Should provide access to stocks and exchange rates in a carousel
 */
const Indexes = () => {
  const [showing, setShowing] = useState(0);
  const token = useSelector(selectToken);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const prev = () => setShowing((c) => (c === 0 ? indexes.length - 1 : c - 1));
  const next = () => setShowing((c) => (c === indexes.length - 1 ? 0 : c + 1));

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
            minWidth: 0,
            maxWidth: { xs: "100%", sm: 500 },
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center" }}>
            {indexes[showing]}
          </Box>
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
        {indexes.map((_, index) => (
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

export default Indexes;
