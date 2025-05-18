import { render, screen } from "@testing-library/react";
import ExpenseItem from "./ExpenseItem";
import { BrowserRouter } from "react-router-dom";

describe("ExpenseItem", () => {
  it("renders expense details", () => {
    const expense = {
      id: 1,
      name: "Coffee",
      amount: 3.5,
      date: "2024-05-10",
      category: "Food",
      budget: "Monthly",
    };
    render(
      <BrowserRouter>
        <ExpenseItem expense={expense} />
      </BrowserRouter>
    );
    expect(screen.getByText(/coffee/i)).toBeInTheDocument();
    expect(screen.getByText(/food/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-05-10/i)).toBeInTheDocument();
    expect(screen.getByText(/€ 3.5/i)).toBeInTheDocument();
  });
});
