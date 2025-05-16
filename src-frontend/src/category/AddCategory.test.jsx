import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import AddCategory from "./AddCategory";
import categoryReducer from "../store/categorySlice";
import authReducer from "../store/authSlice";

const testStore = configureStore({
  reducer: {
    category: categoryReducer,
    auth: authReducer,
  },
  preloadedState: {
    auth: { token: "fake-token" },
    category: {},
  },
});

function renderWithProviders(ui) {
  return render(
    <Provider store={testStore}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe("AddCategory", () => {
  it("renders add category form", () => {
    renderWithProviders(<AddCategory />);
    expect(screen.getByLabelText(/category name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add category/i })
    ).toBeInTheDocument();
  });

  it("allows typing in the category name", () => {
    renderWithProviders(<AddCategory />);
    const input = screen.getByLabelText(/category name/i);
    fireEvent.change(input, { target: { value: "Travel" } });
    expect(input.value).toBe("Travel");
  });
});
