import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ExpenseerAPI from "../helper/api";

// Thunk to get all budgets created for the logged user
const getBudgets = createAsyncThunk(
  "budget/getBudgets",
  async (token, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.getBudgets();
    if (!response) throw new Error("Failed to read Budgets");
    return response;
  }
);

// Thunk to get detail of one specific budget provided as argument
const getBudget = createAsyncThunk(
  "budget/getBudget",
  async ({ token, name }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.getBudget(name);
    if (!response) throw new Error("Failed to read Budget");
    return response;
  }
);

// Thunk to regster a new budget for the user
const addBudget = createAsyncThunk(
  "budget/addBudget",
  async ({ token, data }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.addBudget(data);
    if (!response) throw new Error("Failed to add Budget");
    await thunkAPI.dispatch(getBudgets(token));
    return response;
  }
);

// Thunk to update budget information, budget name and data
//  provided as argument
const editBudget = createAsyncThunk(
  "budget/editBudget",
  async ({ token, name, data }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.editBudget(name, data);
    if (!response) throw new Error("Failed to edit Budget");
    await thunkAPI.dispatch(getBudgets(token));
    return response;
  }
);

// Thunk to delete budget data, budget provided as argument
const deleteBudget = createAsyncThunk(
  "budget/deleteBudget",
  async ({ token, name }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.deleteBudget(name);
    if (!response) throw new Error("Failed to delete Budget");
    await thunkAPI.dispatch(getBudgets(token));
    return response;
  }
);

// constant for starting point for the budget slice
const initialState = {
  budgets: [],
  loading: false,
  error: null,
};

/** Redux Budget Slice
 *
 * Should store budget information and thunk reducers
 */
const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    clearBudgets(state) {
      state.budgets = [];
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(getBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBudget.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBudget.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(editBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBudget.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearBudgets } = budgetSlice.actions;
export { getBudgets, getBudget, addBudget, editBudget, deleteBudget };

// Define selectors for data easy access
export const selectBudgets = (state) => state.budget.budgets;
export const selectBudgetLoading = (state) => state.budget.loading;
export const selectBudgetError = (state) => state.budget.error;

export default budgetSlice.reducer;
