import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  selectCategories,
  selectCategoryLoading,
  selectCategoryError,
} from "../../store/categorySlice";
import { selectToken } from "../../store/authSlice";
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
  Box,
  Stack,
} from "@mui/material";

/** Categories components
 *
 * Lists all categories created by the user
 * Data extracted from Redux store
 */
const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);
  const token = useSelector(selectToken);

  // Load categories on page render
  useEffect(() => {
    if (token && categories.length === 0) {
      dispatch(getCategories(token));
    }
  }, [token, categories.length, dispatch]);

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        width: { xs: "80vw", sm: 480 },
        maxWidth: "100vw",
        minWidth: { xs: "0", sm: "400px" },
        mx: "auto",
        mt: 4,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {categories.map((category, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton
                component={Link}
                to={`/categories/${category.name}/edit`}
                edge="end"
                aria-label="edit"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </IconButton>
            }
            disablePadding
            sx={{
              alignItems: "flex-start",
            }}
          >
            <ListItemText
              primary={
                <Button
                  component={Link}
                  to={`/categories/${category.name}`}
                  sx={{
                    textTransform: "none",
                    width: "100%",
                    maxWidth: "100%",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    textAlign: "left",
                    pr: 5, // padding right to avoid overlap with icon
                    display: "block",
                  }}
                >
                  {category.name}
                </Button>
              }
              sx={{
                width: "100%",
                maxWidth: "100%",
                pr: 0,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          component={Link}
          to="/add-category"
          color="primary"
        >
          Add Category
        </Button>
      </Stack>
    </Paper>
  );
};

export default Categories;
