import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import categoryReducer from "./categorySlice";
import budgetReducer from "./budgetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    budget: budgetReducer,
  },
});

export default store;
