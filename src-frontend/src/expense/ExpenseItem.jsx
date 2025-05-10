import { Link } from "react-router-dom";
import { forwardRef } from "react";
import { TableRow, TableCell } from "@mui/material";

/** Expense Item component
 *
 * Show information of each expense in the expenses list table
 */
const ExpenseItem = forwardRef(({ expense }, ref) => {
  const { id, name, amount, date, category, budget } = expense;
  return (
    <TableRow ref={ref}>
      <TableCell>{new Date(date).toISOString().split("T")[0]}</TableCell>
      <TableCell>
        <Link to={`/expenses/${id}`}>{name}</Link>
      </TableCell>
      <TableCell>€ {amount}</TableCell>
      <TableCell>{category}</TableCell>
      <TableCell>{budget}</TableCell>
    </TableRow>
  );
});

export default ExpenseItem;
