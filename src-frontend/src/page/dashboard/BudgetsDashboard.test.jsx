import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import BudgetsDashboard from "./BudgetsDashboard";
import authReducer from "../../store/authSlice";
import budgetReducer from "../../store/budgetSlice";

// Mock useDashboard hook if used
vi.mock("../../customHook/useDashboard", () => ({
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

vi.mock("../../helper/api", () => ({
  __esModule: true,
  default: {
    getExpenseDashboard: vi.fn(() =>
      Promise.resolve([
        {
          budget: "Test Budget",
          percent_used: 50,
          total_amount: 500,
          budget_amount: 1000,
        },
      ])
    ),
  },
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

describe("BudgetDashboard", () => {
  it("renders dashboard sections and data", async () => {
    renderWithProviders(<BudgetsDashboard />);
    // Wait for the heading
    expect(
      await screen.findByRole("heading", { name: /expenses by budget/i })
    ).toBeInTheDocument();
    // Wait for the budget name to appear
    expect(await screen.findByText(/test budget/i)).toBeInTheDocument();
    expect(screen.getByText(/50% used/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(
        (content, node) =>
          node.textContent.includes("Spent:") &&
          node.textContent.includes("500")
      )[0]
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(
        (content, node) =>
          node.textContent.includes("Budget:") &&
          node.textContent.includes("1000")
      )[0]
    ).toBeInTheDocument();
  });
});
