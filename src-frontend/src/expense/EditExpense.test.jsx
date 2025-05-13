import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import EditExpense from "./EditExpense";
import authReducer from "../store/authSlice";
import budgetReducer from "../store/budgetSlice";
import categoryReducer from "../store/categorySlice";

// Mock ExpenseerAPI
vi.mock("../helper/api", () => ({
  __esModule: true,
  default: {
    getExpense: vi.fn(() =>
      Promise.resolve({
        id: 1,
        name: "Coffee",
        amount: 3.5,
        date: "2024-05-10",
        category: "Food",
        budget: "Monthly",
        description: "Morning coffee",
      })
    ),
    editExpense: vi.fn(() => Promise.resolve(true)),
  },
}));

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

function renderWithProviders(ui, { route = "/expenses/1/edit" } = {}) {
  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/expenses/:id/edit" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("EditExpense", () => {
  it("renders edit expense form fields", async () => {
    renderWithProviders(<EditExpense />);
    expect(await screen.findByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });
});
