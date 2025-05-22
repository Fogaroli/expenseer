import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import BudgetsDashboard from "./BudgetsDashboard";
import authReducer from "../../store/authSlice";
import budgetReducer from "../../store/budgetSlice";

vi.mock("../../helper/api", () => ({
  __esModule: true,
  default: {
    getSummaryDashboard: vi.fn(() =>
      Promise.resolve([
        {
          budget: "Test Budget",
          type: 1,
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
      screen.getAllByText((content, node) =>
        node.textContent.includes("50% used")
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
