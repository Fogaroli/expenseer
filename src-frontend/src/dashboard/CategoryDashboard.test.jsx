import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import CategoryDashboard from "./CategoryDashboard";
import authReducer from "../store/authSlice";
import categoryReducer from "../store/categorySlice";

// Mock useDashboard hook if used
vi.mock("../customHook/useDashboard", () => ({
  __esModule: true,
  default: () => ({
    currentMonth: {
      total_amount: 200,
      month: "2024-05",
    },
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

vi.mock("../helper/api", () => ({
  __esModule: true,
  default: {
    getExpenseDashboard: vi.fn(() =>
      Promise.resolve([
        { category: "Food", total_amount: 200 },
        { category: "Transport", total_amount: 50 },
      ])
    ),
  },
}));

const testStore = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
  },
  preloadedState: {
    auth: { token: "fake-token" },
    category: {},
  },
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

describe("CategoryDashboard", () => {
  it("renders dashboard sections and data", async () => {
    renderWithProviders(<CategoryDashboard />);
    expect(
      await screen.findByRole("heading", { name: /expenses by category/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Food/i)).toBeInTheDocument();
    expect(screen.getByText(/\$ 200/i)).toBeInTheDocument();
    expect(screen.getByText(/Transport/i)).toBeInTheDocument();
    expect(screen.getByText(/\$ 50/i)).toBeInTheDocument();
  });
});
