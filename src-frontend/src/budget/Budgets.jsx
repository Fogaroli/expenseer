import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getBudgets,
  selectBudgets,
  selectBudgetLoading,
  selectBudgetError,
} from "../store/budgetSlice";
import { selectToken } from "../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Stack,
} from "@mui/material";

/** Budgets components
 *
 * Lists all budgets created by the user
 * Data extracted from Redux store
 */
const Budgets = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(selectBudgets);
  const loading = useSelector(selectBudgetLoading);
  const error = useSelector(selectBudgetError);
  const token = useSelector(selectToken);

  // Load budgets on page render
  useEffect(() => {
    if (token && budgets.length === 0) {
      dispatch(getBudgets(token));
    }
  }, [token, budgets.length, dispatch]);

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Budgets
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {budgets.map((budget, idx) => (
          <ListItem key={idx} disablePadding>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ width: "100%", px: 2, py: 1 }}
            >
              {/* Name: flex-grow to take available space */}
              <Button
                component={Link}
                to={`/budgets/${budget.name}`}
                sx={{
                  textTransform: "none",
                  flex: 1,
                  justifyContent: "flex-start",
                }}
              >
                {budget.name}
              </Button>
              {/* Amount: fixed width, right-aligned */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ minWidth: 90, textAlign: "right" }}
              >
                ${budget.amount}
              </Typography>
              {/* Edit icon */}
              <IconButton
                component={Link}
                to={`/budgets/${budget.name}/edit`}
                edge="end"
                aria-label="edit"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          component={Link}
          to="/add-budget"
          color="primary"
        >
          Add Budget
        </Button>
      </Stack>
    </Paper>
  );
};

export default Budgets;
