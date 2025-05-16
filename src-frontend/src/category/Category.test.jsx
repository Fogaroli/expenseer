import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Category from "./Category";
import authReducer from "../store/authSlice";

// Mock useDashboard hook
vi.mock("../customHook/useDashboard", () => ({
  __esModule: true,
  default: () => ({
    currentMonth: { month: "2024-05", total_amount: 200 },
    history: [
      { month: "2024-01", total_amount: 100 },
      { month: "2024-02", total_amount: 150 },
    ],
    expenses: [
      { date: "2024-05-01", name: "Lunch", amount: 20, budget: "Food" },
      { date: "2024-05-02", name: "Dinner", amount: 30, budget: "Food" },
    ],
    isLoading: false,
    error: null,
  }),
}));

const testStore = configureStore({
  reducer: { auth: authReducer },
  preloadedState: { auth: { token: "fake-token" } },
});

function renderWithProviders(ui, { route = "/categories/Food" } = {}) {
  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/categories/:categoryName" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("Category", () => {
  it("renders category dashboard sections and data", () => {
    renderWithProviders(<Category />);
    expect(screen.getByRole("heading", { name: /Food/i })).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-05 - \$200/i)).toBeInTheDocument();
    expect(screen.getByText(/History \(last 6 months\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Latest Expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/Lunch/i)).toBeInTheDocument();
    expect(screen.getByText(/Dinner/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add new Expense/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /See All/i })
    ).toBeInTheDocument();
  });
});
