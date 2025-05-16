import { render, screen, fireEvent } from "@testing-library/react";
import Stocks from "./Stocks";

// Mock the custom hook
vi.mock("../customHook/useStocks", () => ({
  __esModule: true,
  default: () => ({
    stocksData: [
      { symbol: "AAPL", value: 180, variation: 1.2 },
      { symbol: "MSFT", value: 320, variation: -0.5 },
    ],
    searchResults: [
      { symbol: "GOOG", name: "Alphabet Inc." },
      { symbol: "TSLA", name: "Tesla Inc." },
    ],
    loading: false,
    error: null,
    addStock: vi.fn(),
    deleteStock: vi.fn(),
    searchStocks: vi.fn(),
    clearResults: vi.fn(),
  }),
}));

describe("Stocks", () => {
  it("renders heading, pinned stocks, and search form", () => {
    render(<Stocks />);
    expect(
      screen.getByRole("heading", { name: /stock values/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/AAPL 180 1.2%/i)).toBeInTheDocument();
    expect(screen.getByText(/MSFT 320 -0.5%/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/search stock/i)).toBeInTheDocument();
  });

  it("renders search results and add button", () => {
    render(<Stocks />);
    expect(screen.getByText(/GOOG - Alphabet Inc./i)).toBeInTheDocument();
    expect(screen.getByText(/TSLA - Tesla Inc./i)).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("button")
        .some((btn) => btn.innerHTML.includes("fa-thumbtack"))
    ).toBe(true);
  });

  it("allows typing and submitting the search form", () => {
    render(<Stocks />);
    fireEvent.change(screen.getByLabelText(/search stock/i), {
      target: { value: "AMZN" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
  });
});
