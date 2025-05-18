import { Link } from "react-router-dom";
import { forwardRef } from "react";
import { Paper, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/** Expense Item component
 *
 * Show information of each expense in the expenses list table
 */
const ExpenseItem = forwardRef(({ expense }, ref) => {
  const { id, name, amount, date, category, budget } = expense;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      ref={ref}
      elevation={2}
      sx={{
        mb: 2,
        px: 1,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        {/* Date */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexBasis: { xs: "30%", sm: "18%" },
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          {new Date(date).toISOString().split("T")[0]}
        </Typography>
        {/* Name */}
        <Typography
          variant="body1"
          component={Link}
          to={`/expenses/${id}`}
          sx={{
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexBasis: { xs: "50%", sm: "50%" },
            flexGrow: 1,
            minWidth: 0,
            mx: 1,
          }}
        >
          {name}
        </Typography>
        {/* Amount */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            flexBasis: { xs: "20%", sm: "18%" },
            textAlign: "right",
            minWidth: 0,
            mx: 1,
          }}
        >
          ${amount}
        </Typography>
        {/* Category */}
        {!isMobile && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexBasis: "16%",
              minWidth: 0,
              mx: 1,
              textAlign: "center",
            }}
          >
            {category}
          </Typography>
        )}
        {/* Budget */}
        {!isMobile && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexBasis: "16%",
              minWidth: 0,
              mx: 1,
              textAlign: "center",
            }}
          >
            {budget}
          </Typography>
        )}
      </Box>
    </Paper>
  );
});

export default ExpenseItem;
