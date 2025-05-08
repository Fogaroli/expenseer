import { Link } from "react-router-dom";

/** Expense Item component
 *
 * Show information of each expense in the expenses list table
 */
const ExpenseItem = ({ expense }) => {
  const { id, name, amount, date, category, budget } = expense;
  return (
    <>
      <td>{new Date(date).toISOString().split("T")[0]}</td>
      <td>
        <Link to={`/expenses/${id}`}>{name}</Link>
      </td>
      <td>€ {amount}</td>
      <td>{category}</td>
      <td>{budget}</td>
    </>
  );
};

export default ExpenseItem;
