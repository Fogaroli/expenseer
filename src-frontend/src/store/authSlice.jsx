import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ExpenseerAPI from "../helper/api";
import Cookies from "js-cookie";

/** Thunk to get user information
 * returns { username, first_name, last_name, email, last_logged, image_url, ?is_admin }
 */
const getUserData = createAsyncThunk(
  "auth/getUserData",
  async ({ token, username }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.getUser(username);
    if (!response) throw new Error("Failed to fetch user info");
    return response;
  }
);

/** Thunk to login user
 *
 * returns { token, last_logged }
 *
 */
const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    const response = await ExpenseerAPI.login({ username, password });
    if (!response) {
      throw new Error("Login failed");
    }
    await thunkAPI.dispatch(getUserData({ token: response.token, username }));
    return response;
  }
);

/** Thunk for user registration
 *
 * returns { token, last_logged }
 */
const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    const response = await ExpenseerAPI.register(userData);
    if (!response) {
      throw new Error("Registration failed");
    }
    await thunkAPI.dispatch(
      getUserData({ token: response.token, username: userData.username })
    );
    return response;
  }
);

// constant for starting point for the authentication slice
const initialState = {
  token: Cookies.get("token") || null,
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  loading: false,
  error: null,
};

/** Redux Authentication Slice
 *
 * Should store user information logout and thunk reducers
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      Cookies.remove("token");
      Cookies.remove("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        Cookies.set("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        Cookies.set("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        Cookies.set("user", JSON.stringify(action.payload));
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export { getUserData, login, register };

// Define selectors for data easy access
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectUserError = (state) => state.auth.error;
export const selectUserLoading = (state) => state.auth.loading;

export default authSlice.reducer;
