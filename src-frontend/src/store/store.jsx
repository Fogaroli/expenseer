import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import categoryReducer from "./categorySlice";
import budgetReducer from "./budgetSlice";

/** Redux Store
 * Site wide storage for user authentication, categories and budgets
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    budget: budgetReducer,
  },
});

export default store;
