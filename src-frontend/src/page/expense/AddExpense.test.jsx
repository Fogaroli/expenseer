import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import AddExpense from "./AddExpense";
import authReducer from "../../store/authSlice";
import budgetReducer from "../../store/budgetSlice";
import categoryReducer from "../../store/categorySlice";

// Mock categories and budgets for dropdowns
const mockCategories = [{ name: "Food" }, { name: "Travel" }];
const mockBudgets = [{ name: "Monthly" }, { name: "Vacation" }];

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

describe("AddExpense", () => {
  it("renders add expense form fields", () => {
    renderWithProviders(<AddExpense />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /register new expense/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("allows typing and selecting in the form", async () => {
    renderWithProviders(<AddExpense />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Coffee" },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: 3.5 },
    });

    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/category/i));
    await user.click(screen.getByRole("option", { name: "Food" }));
    await user.click(screen.getByLabelText(/budget/i));
    await user.click(screen.getByRole("option", { name: "Monthly" }));
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Morning coffee" },
    });
    expect(screen.getByLabelText(/name/i).value).toBe("Coffee");
    expect(screen.getByLabelText(/amount/i).value).toBe("3.5");
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i).value).toBe("Morning coffee");
  });
});
