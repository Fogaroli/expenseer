import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  register,
  selectUserError,
  selectUser,
  selectUserLoading,
} from "../store/authSlice";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

/** Registration component
 * Allow account creation
 */
const Register = () => {
  const cleanForm = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
  };
  const [formData, setFormData] = useState(cleanForm);
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handles register button click, send credentials to redux store - auth slice
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
      setFormData(cleanForm);
      navigate("/");
    } catch (err) {
      console.error("Registration failed: ", err);
    }
  };

  // Form update handler
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        mt: 3,
        mx: "auto",
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Create your account
      </Typography>

      <Typography variant="body1" gutterBottom>
        Fill in the form below to register
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="first_name"
          label="First Name"
          name="first_name"
          autoComplete="given-name"
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
          autoComplete="family-name"
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
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          Register
        </Button>

        {loading && <Typography>Loading...</Typography>}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button component={Link} to="/login" variant="text">
            Log In
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Register;
