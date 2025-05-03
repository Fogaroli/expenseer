const EditExpense = () => {
  return (
    <div>
      <h1>Edit Expense</h1>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" name="amount" />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
export default EditExpense;
