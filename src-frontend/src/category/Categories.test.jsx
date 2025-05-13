import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Categories from "./Categories";
import categoryReducer from "../store/categorySlice";
import authReducer from "../store/authSlice";

const mockCategories = [{ name: "Food" }, { name: "Utilities" }];

const testStore = configureStore({
  reducer: {
    category: categoryReducer,
    auth: authReducer,
  },
  preloadedState: {
    auth: { token: "fake-token" },
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

describe("Categories", () => {
  it("renders categories list and add button", () => {
    renderWithProviders(<Categories />);

    expect(
      screen.getByRole("heading", { name: /categories/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /add category/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Food/i)).toBeInTheDocument();
    expect(screen.getByText(/Utilities/i)).toBeInTheDocument();
  });

  it("shows loading indicator", () => {
    const loadingStore = configureStore({
      reducer: { category: categoryReducer, auth: authReducer },
      preloadedState: {
        auth: { token: "fake-token" },
        category: { categories: [], loading: true, error: null },
      },
    });
    render(
      <Provider store={loadingStore}>
        <BrowserRouter>
          <Categories />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
