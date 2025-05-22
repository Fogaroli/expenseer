import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import EditCategory from "./EditCategory";
import categoryReducer from "../../store/categorySlice";
import authReducer from "../../store/authSlice";

// Mock getCategory thunk to avoid API call
vi.mock("../../store/categorySlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getCategory: () => () => ({
      unwrap: () => Promise.resolve({ name: "Mocked Category" }),
    }),
  };
});

const testStore = configureStore({
  reducer: {
    category: categoryReducer,
    auth: authReducer,
  },
  preloadedState: {
    auth: { token: "fake-token" },
    category: { loading: false, error: null, updateSuccess: false },
  },
});

function renderWithProviders(
  ui,
  { route = "/categories/MockedCategory/edit" } = {}
) {
  return render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/categories/:categoryName/edit" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("EditCategory", () => {
  it("renders edit category form fields", async () => {
    renderWithProviders(<EditCategory />);
    expect(
      await screen.findByRole("heading", { name: /edit category/i })
    ).toBeInTheDocument();
    expect(await screen.findByLabelText(/category name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update category/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete category/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });
});
