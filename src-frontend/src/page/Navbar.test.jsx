import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../store/store.jsx";
import Navbar from "./Navbar";
import { login } from "../store/authSlice";

function renderWithProviders(ui) {
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe("Navbar", () => {
  it("shows Login and Register when not logged in", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("shows user-specific options when logged in", async () => {
    store.dispatch(
      login.fulfilled({ token: "mockToken" }, "login", {
        username: "testuser",
        password: "password",
      })
    );

    store.dispatch({
      type: "auth/getUserData/fulfilled",
      payload: { username: "testuser", first_name: "Test", last_name: "User" },
    });

    renderWithProviders(<Navbar />);

    expect(
      screen.getByRole("button", { name: /dashboards/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Test User/i })
    ).toBeInTheDocument();
  });
});
