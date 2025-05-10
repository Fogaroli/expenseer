import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../store/authSlice";
import Stocks from "./Stocks";
import Exchanges from "./Exchanges";
import { Paper, Box, IconButton, Stack } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const indexes = [<Stocks />, <Exchanges />];

/** Main Indexes component
 * Should provide access to stocks and exchange rates in a carousel
 */
const Indexes = () => {
  const [showing, setShowing] = useState(0);
  const token = useSelector(selectToken);
  if (!token) {
    return <Navigate to="/" />;
  }

  const prev = () => setShowing((c) => (c === 0 ? indexes.length - 1 : c - 1));
  const next = () => setShowing((c) => (c === indexes.length - 1 ? 0 : c + 1));

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

export default Indexes;
