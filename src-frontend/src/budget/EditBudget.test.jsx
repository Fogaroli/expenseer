import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import budgetReducer from "../store/budgetSlice";
import AddBudget from "./AddBudget";

// Create a test store with a fake token
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

function renderWithProviders(ui) {
  return render(
    <Provider store={testStore}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe("AddBudget", () => {
  it("renders add budget form fields", () => {
    renderWithProviders(<AddBudget />);
    screen.debug(); // See what is rendered!
    // Update these queries to match your actual labels
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });
});
