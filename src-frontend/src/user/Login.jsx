import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  clearError,
  selectUserError,
  selectUser,
  selectUserLoading,
} from "../store/authSlice";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

/** Login component
 * For registered users
 */
const Login = () => {
  const emptyForm = { username: "", password: "" };
  const [formData, setFormData] = useState(emptyForm);
  const error = useSelector(selectUserError);
  const loading = useSelector(selectUserLoading);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear error message when unmounting the component
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handles login button click, send credentials to redux store - auth slice
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      setFormData(emptyForm);
      navigate("/");
    } catch (err) {
      console.error("Login failed: ", err);
    }
  };

  const loginDemonstration = async (evt) => {
    evt.preventDefault();
    try {
      await dispatch(
        login({ username: "demonstration", password: "demonstration" })
      ).unwrap();
      setFormData(emptyForm);
      navigate("/");
    } catch (err) {
      console.error("Demonstration login failed: ", err);
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
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back!
      </Typography>

      <Typography variant="body1" gutterBottom>
        Please enter your credentials in the form below.
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
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>

        {loading && <Typography>Loading...</Typography>}
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          Want to take a peek into the portal features?
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            onClick={loginDemonstration}
          >
            Login with Demonstration user
          </Button>
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Button component={Link} to="/register" variant="text">
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Login;
