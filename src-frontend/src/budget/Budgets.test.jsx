import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import budgetReducer from "../store/budgetSlice";
import Budgets from "./Budgets";

const testStore = configureStore({
  reducer: {
    auth: authReducer,
    budget: budgetReducer,
  },
  preloadedState: {
    auth: { token: "fake-token" },
    budget: { budgets: [] }, // <-- Fix: ensure budgets is an array
  },
});

function renderWithProviders(ui) {
  return render(
    <Provider store={testStore}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe("Budgets", () => {
  it("renders budgets heading and add button", () => {
    renderWithProviders(<Budgets />);
    expect(
      screen.getByRole("heading", { name: /budgets/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /add budget/i })
    ).toBeInTheDocument();
  });
});
