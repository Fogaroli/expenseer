import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import budgetReducer from "../store/budgetSlice";
import Budget from "./Budget";

// Mock the useDashboard hook to provide predictable data
vi.mock("../customHook/useDashboard", () => ({
  __esModule: true,
  default: () => ({
    currentMonth: {
      budget_amount: 1000,
      total_amount: 500,
      percent_used: 50,
      month: "2024-05",
    },
    history: [
      { month: "2024-01", budget_amount: 1000, total_amount: 800 },
      { month: "2024-02", budget_amount: 1000, total_amount: 1200 },
    ],
    expenses: [
      { date: "2024-05-01", name: "Groceries", amount: 100, category: "Food" },
      { date: "2024-05-02", name: "Rent", amount: 400, category: "Housing" },
    ],
    isLoading: false,
    error: null,
  }),
}));

const testStore = configureStore({
  reducer: {
    auth: authReducer,
    budget: budgetReducer,
  },
  preloadedState: {
    auth: { token: "fake-token" },
    budget: {},
  },
});

function renderWithProviders(ui, { route = "/budgets/test-budget" } = {}) {
  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/budgets/:budgetName" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("Budget", () => {
  it("renders budget dashboard sections and data", () => {
    screen.debug();
    renderWithProviders(<Budget />);
    // Heading with budget name from route param
    expect(screen.getByText(/test-budget/i)).toBeInTheDocument();
    // Budget value
    expect(screen.getByText(/Budget Value \$1000/i)).toBeInTheDocument();
    // Status section
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-05 - \$500/i)).toBeInTheDocument();
    expect(screen.getByText(/50% used/i)).toBeInTheDocument();
    // Last 6 Months section
    expect(screen.getByText(/Last 6 Months/i)).toBeInTheDocument();
    // Latest Expenses section
    expect(screen.getByText(/Latest Expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/Groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/Rent/i)).toBeInTheDocument();
    // Action buttons
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add new Expense/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /See All/i })
    ).toBeInTheDocument();
  });
});
