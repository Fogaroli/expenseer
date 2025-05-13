import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Exchanges from "./Exchanges";

// Mock the custom hook
vi.mock("../customHook/useExchange", () => ({
  __esModule: true,
  default: () => ({
    exchangeData: [
      { currency1: "USD", currency2: "EUR", rate: 0.92 },
      { currency1: "USD", currency2: "BRL", rate: 5.1 },
    ],
    availableCurrency: ["USD", "EUR", "BRL"],
    instantRate: { currency1: "EUR", currency2: "BRL", rate: 5.5 },
    loading: false,
    error: null,
    addExchange: vi.fn(),
    deleteExchange: vi.fn(),
    getExchange: vi.fn(),
  }),
}));

describe("Exchanges", () => {
  it("renders heading, pinned exchanges, and form", () => {
    render(<Exchanges />);
    expect(
      screen.getByRole("heading", { name: /currency exchange/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/USD \/ EUR: 0.92/i)).toBeInTheDocument();
    expect(screen.getByText(/USD \/ BRL: 5.1/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /check rate/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByText(/choose an exchange/i)).toBeInTheDocument();
  });

  it("renders instant rate and add button", () => {
    render(<Exchanges />);
    expect(screen.getByText(/EUR \/ BRL: 5.5/i)).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("button")
        .some((btn) => btn.innerHTML.includes("fa-thumbtack"))
    ).toBe(true);
  });

  it("allows selecting currencies and submitting the form", async () => {
    render(<Exchanges />);
    const user = userEvent.setup();

    // Open the "from" select and pick "USD"
    await user.click(screen.getByLabelText(/from/i));
    await user.click(screen.getByRole("option", { name: "USD" }));

    // Open the "to" select and pick "EUR"
    await user.click(screen.getByLabelText(/to/i));
    await user.click(screen.getByRole("option", { name: "EUR" }));

    await user.click(screen.getByRole("button", { name: /check rate/i }));
  });
});
