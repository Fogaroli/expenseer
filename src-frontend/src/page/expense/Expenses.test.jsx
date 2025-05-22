import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Expenses from "./Expenses";
import authReducer from "../../store/authSlice";
import budgetReducer from "../../store/budgetSlice";
import categoryReducer from "../../store/categorySlice";

// Mock categories, budgets, and expenses
const mockCategories = [{ name: "Food" }];
const mockBudgets = [{ name: "Monthly" }];

const testStore = configureStore({
  reducer: {
    auth: authReducer,
    budget: budgetReducer,
    category: categoryReducer,
  },
  preloadedState: {
    auth: { token: "fake-token" },
    budget: { budgets: mockBudgets, loading: false, error: null },
    category: { categories: mockCategories, loading: false, error: null },
  },
});

function renderWithProviders(ui) {
  return render(
    <Provider store={testStore}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe("Expenses", () => {
  it("renders expenses page and filter fields", () => {
    renderWithProviders(<Expenses />);
    expect(
      screen.getByRole("heading", { level: 1, name: /expenses/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /filters/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /clear filters/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new expense/i })
    ).toBeInTheDocument();
  });
});
