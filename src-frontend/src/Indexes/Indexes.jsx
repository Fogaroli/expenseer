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
  const [hover, setHover] = useState(false);
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
            {indexes[showing]}
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
      </Paper>
    </Box>
  );
};

export default Indexes;
