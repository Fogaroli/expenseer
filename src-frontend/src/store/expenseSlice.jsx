import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ExpenseerAPI from "../helper/api";

const getCategories = createAsyncThunk(
  "expense/getCategories",
  async (token, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.getCategories();
    if (!response) throw new Error("Failed to read categories");
    return response;
  }
);

const addCategory = createAsyncThunk(
  "expense/addCategory",
  async ({ token, name }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.addCategory({ name });
    if (!response) throw new Error("Failed to add category");
    await thunkAPI.dispatch(getCategories(token));
    return response;
  }
);

const getBudgets = createAsyncThunk(
  "expense/getBudgets",
  async (token, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.getBudgets();
    if (!response) throw new Error("Failed to read budgets");
    return response;
  }
);

const initialState = {
  categories: [],
  budgets: [],
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(getBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export { getCategories, addCategory, getBudgets };

export const selectCategories = (state) => state.expense.categories;
export const selectBudgets = (state) => state.expense.budgets;
export const selectLoading = (state) => state.expense.loading;
export const selectError = (state) => state.expense.error;

export default expenseSlice.reducer;
