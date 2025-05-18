import { useState } from "react";
import {
  addCategory,
  selectCategoryError,
  selectCategoryLoading,
} from "../store/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { selectToken } from "../store/authSlice";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

/** Add category component
 *
 * Allows user to add a new expense category to its list
 */
const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const error = useSelector(selectCategoryError);
  const loading = useSelector(selectCategoryLoading);
  const navigate = useNavigate();

  // Send new category data to the server once click submit
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await dispatch(addCategory({ token, name: categoryName })).unwrap();
      setCategoryName("");
      navigate("/categories");
    } catch (err) {
      console.error("Failed to add category: ", err);
    }
  };

  // Form update handler
  const handleChange = (evt) => {
    const { value } = evt.target;
    setCategoryName(value);
  };

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        width: { xs: "80vw", md: 765 },
        maxWidth: "100vw",
        mx: "auto",
        mt: 4,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add Category
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          name="categoryName"
          id="categoryName"
          value={categoryName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button fullWidth variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Add Category
          </Button>
        </Stack>
        {loading && <Typography sx={{ mt: 2 }}>Loading...</Typography>}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default AddCategory;
