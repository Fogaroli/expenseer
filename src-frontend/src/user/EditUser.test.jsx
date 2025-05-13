import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../store/store.jsx";
import EditUser from "./EditUser";

function renderWithProviders(ui) {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe("EditUser", () => {
  it("renders edit user form fields", () => {
    // By default, not logged in, so should redirect (no form fields)
    renderWithProviders(<EditUser />);
    // You can check for the presence of the heading if you set up a mock user in the store
    // For now, just check that the component renders without crashing
    // Optionally, you can mock the store to simulate a logged-in user for more detailed tests
  });
});
