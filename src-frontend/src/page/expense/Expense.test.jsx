import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Expense from "./Expense";
import authReducer from "../../store/authSlice";

// Mock ExpenseerAPI
vi.mock("../../helper/api", () => ({
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
    deleteExpense: vi.fn(() => Promise.resolve(true)),
  },
}));

const testStore = configureStore({
  reducer: { auth: authReducer },
  preloadedState: { auth: { token: "fake-token" } },
});

function renderWithProviders(ui, { route = "/expenses/1" } = {}) {
  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/expenses/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("Expense", () => {
  it("renders expense details and buttons", async () => {
    renderWithProviders(<Expense />);
    expect(
      await screen.findByRole("heading", { name: /coffee/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/amount: € 3.5/i)).toBeInTheDocument();
    expect(screen.getByText(/category: food/i)).toBeInTheDocument();
    expect(screen.getByText(/budget: monthly/i)).toBeInTheDocument();
    expect(
      screen.getByText(/description: morning coffee/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
