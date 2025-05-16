import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategory,
  editCategory,
  clearSuccess,
  clearError,
  deleteCategory,
  selectCategoryError,
  selectCategoryLoading,
  selectUpdateSuccess,
} from "../store/categorySlice";
import { selectToken } from "../store/authSlice";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

/** Edit Category Component
 *
 * Allow user to modify information for the category
 */
const EditCategory = () => {
  const { categoryName } = useParams();
  const [categoryData, setCategoryData] = useState({ name: "" });
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);
  const token = useSelector(selectToken);
  const updateSuccess = useSelector(selectUpdateSuccess);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load category data on render
  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(
        getCategory({ token, name: categoryName })
      ).unwrap();
      setCategoryData(response);
    };
    fetchData();
  }, [categoryName, dispatch, token]);

  // Form update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  // Clear success message when unmounting the component
  useEffect(() => {
    return () => {
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [dispatch]);

  // Send update request to the server with the information from the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      editCategory({ token, name: categoryName, data: categoryData })
    ).unwrap();
    if (response) {
      setCategoryData(response);
    }
  };

  // Sends the delete request once the delete button is clicked
  const handleDelete = async (evt) => {
    evt.preventDefault();
    const response = await dispatch(
      deleteCategory({ token, name: categoryName })
    ).unwrap();
    if (response) {
      navigate("/categories");
    }
  };

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Category
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          name="name"
          id="categoryName"
          value={categoryData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        {updateSuccess && (
          <Typography color="success" sx={{ mt: 2 }}>
            Update Successful
          </Typography>
        )}
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
            Update Category
          </Button>
          <Button
            fullWidth
            type="button"
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete Category
          </Button>
        </Stack>
      </Box>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};
export default EditCategory;
