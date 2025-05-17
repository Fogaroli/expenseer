import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  editUser,
  clearSuccess,
  clearError,
  selectUser,
  selectUserError,
  selectUserLoading,
  selectToken,
  selectUpdateSuccess,
} from "../store/authSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";

/** Edit User component
 *
 * Allow user to modify basic information and set an image avatar
 */
const EditUser = () => {
  const INITIALFORM = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    image_url: "",
  };
  const [formData, setFormData] = useState(INITIALFORM);
  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const token = useSelector(selectToken);
  const updateSuccess = useSelector(selectUpdateSuccess);
  const dispatch = useDispatch();

  // Load user data to the form
  useEffect(() => {
    setFormData(user);
  }, [user]);

  // Clear success message when unmounting the component
  useEffect(() => {
    return () => {
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handles save button click, send updated user information to store
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const { username, last_logged, ...data } = formData;
    const response = await dispatch(
      editUser({ token, username, data })
    ).unwrap();
    if (response) setFormData(response);
  };

  // Form update handler
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        width: { xs: "80vw", md: 765 },
        maxWidth: "100vw",
        mt: 3,
        mx: "auto",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Edit User Information
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          alignItems="center"
        >
          <Box
            sx={{
              minWidth: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={formData.image_url || user.image_url}
              alt={formData.username}
              sx={{
                width: 120,
                height: 120,
                objectFit: "contain",
                borderRadius: 2,
                mb: 2,
                bgcolor: "grey.100",
                border: "1px solid #ccc",
              }}
            />
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="image_url"
              label="Image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
            />
            {updateSuccess && (
              <Typography color="success" sx={{ mt: 2 }}>
                Update Successful
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Update
            </Button>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default EditUser;
