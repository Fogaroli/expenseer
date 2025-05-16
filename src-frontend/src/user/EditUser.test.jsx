import { render } from "@testing-library/react";
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
    renderWithProviders(<EditUser />);
  });
});
