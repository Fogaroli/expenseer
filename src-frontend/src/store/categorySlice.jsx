import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ExpenseerAPI from "../helper/api";

const getCategories = createAsyncThunk(
  "category/getCategories",
  async (token, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.getCategories();
    if (!response) throw new Error("Failed to read categories");
    return response;
  }
);

const getCategory = createAsyncThunk(
  "category/getCategory",
  async ({ token, name }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.getCategory(name);
    if (!response) throw new Error("Failed to read category");
    return response;
  }
);

const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ token, name }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.addCategory({ name });
    if (!response) throw new Error("Failed to add category");
    await thunkAPI.dispatch(getCategories(token));
    return response;
  }
);

const editCategory = createAsyncThunk(
  "category/editCategory",
  async ({ token, name, data }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.editCategory(name, data);
    if (!response) throw new Error("Failed to edit category");
    await thunkAPI.dispatch(getCategories(token));
    return response;
  }
);

const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({ token, name }, thunkAPI) => {
    ExpenseerAPI.token = token;
    const response = await ExpenseerAPI.deleteCategory(name);
    if (!response) throw new Error("Failed to delete category");
    await thunkAPI.dispatch(getCategories(token));
    return response;
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
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
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getCategory.rejected, (state, action) => {
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
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
};

export const selectCategories = (state) => state.category.categories;
export const selectCategoryLoading = (state) => state.category.loading;
export const selectCategoryError = (state) => state.category.error;

export default categorySlice.reducer;
