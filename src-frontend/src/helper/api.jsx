import axios from "axios";

const BASE_URL = import.meta.env.VITE_EXPENSEER_API_URL;

class ExpenseerAPI {
  // the JWT for interactive with the API will be stored here.
  static token;

  /** Static function to send HTTP requests  */
  static async request(endpoint, data = {}, params = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: this.token ? this.token : undefined,
    };
    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      if (!err.response) {
        throw new Error("Could not contact server");
      }
      throw new Error(err.response.data.message);
    }
  }

  /** Post request to register new user */
  static async register(data) {
    let res = await this.request(`auth/register`, data, {}, "POST");
    return res;
  }

  /** Post request for user login */
  static async login(credentials) {
    let res = await this.request(`auth/login`, credentials, {}, "POST");
    return res;
  }

  /** Get User information for given valid JWT */
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Edit User information*/
  static async editUser(username, data) {
    let res = await this.request(`users/${username}`, { data }, {}, "PATCH");
    return res.user;
  }

  /** Get all categories */
  static async getCategories() {
    let res = await this.request(`categories`);
    return res.categories;
  }

  /** Get details for a given category */
  static async getCategory(name) {
    let res = await this.request(`categories/${name}`);
    return res.category;
  }

  /** Add new Category */
  static async addCategory(data) {
    let res = await this.request(`categories`, { data }, {}, "POST");
    return res.category;
  }

  /** Edit existing Category */
  static async editCategory(name, data) {
    let res = await this.request(`categories/${name}`, { data }, {}, "PATCH");
    return res.category;
  }

  /** Delete existing Category */
  static async deleteCategory(name) {
    let res = await this.request(`categories/${name}`, {}, {}, "DELETE");
    return res.deleted;
  }

  /** Get all budgets */
  static async getBudgets() {
    let res = await this.request(`budgets`);
    return res.budgets;
  }

  /** Get details for a given budget */
  static async getBudget(budgetName) {
    let res = await this.request(`budgets/${budgetName}`);
    return res.budget;
  }

  /** Add new Budget */
  static async addBudget(data) {
    let res = await this.request(`budgets`, { data }, {}, "POST");
    return res.budget;
  }

  /** Edit existing Budget */
  static async editBudget(budgetName, data) {
    let res = await this.request(
      `budgets/${budgetName}`,
      { data },
      {},
      "PATCH"
    );
    return res.budget;
  }

  /** Delete existing Budget */
  static async deleteBudget(budgetName) {
    let res = await this.request(`budgets/${budgetName}`, {}, {}, "DELETE");
    return res.deleted;
  }

  /** Get Dashboard Data */
  static async getDashboard(target, data) {
    let res = await this.request(
      `dashboards/${target}`,
      {},
      { [target]: data },
      "GET"
    );
    return res.dashboard;
  }

  /** Get Expenses summary */
  static async getExpensesSummary(target, data) {
    let res = await this.request(
      `expenses`,
      {},
      { [target]: data, limit: 5 },
      "GET"
    );
    return res.expenses;
  }

  /** Get Expenses
   * Filters can be provided to narrow down the results
   * Filters can include category, budget, start_date, end_date
   * Example: { category: "Food", budget: "Groceries", start_date: "2023-01-01", end_date: "2023-12-31" }
   * Limit and offset can also be provided to paginate the results
   * Example: { limit: 10, offset: 0 }
   */
  static async getExpenses(filters) {
    let res = await this.request(`expenses`, {}, filters, "GET");
    return res.expenses;
  }

  /** Add new Expense */
  static async addExpense(data) {
    let res = await this.request(`expenses`, { data }, {}, "POST");
    return res.expense;
  }

  /** Edit existing Expense */
  static async editExpense(id, data) {
    let res = await this.request(`expenses/${id}`, { data }, {}, "PATCH");
    return res.expense;
  }

  /** Get details for a given expense */
  static async getExpense(id) {
    let res = await this.request(`expenses/${id}`);
    return res.expense;
  }

  /** Delete expense */
  static async deleteExpense(id) {
    let res = await this.request(`expenses/${id}`, {}, {}, "DELETE");
    return res.deleted;
  }

  /**Get Expense dashboards
   * Dashboard can be by budget or by category
   */
  static async getExpenseDashboard(type) {
    if (type !== "category" && type !== "budget") {
      throw new Error("Incorrect dashboard type");
    }
    let res = await this.request(`dashboards/expenses/${type}`, {}, {}, "GET");
    return res.dashboard[type];
  }

  /** Get updated stocks information already registered by the user */
  static async getStocks() {
    let res = await this.request(`stocks`, {}, {}, "GET");
    return res.stocks;
  }

  /** Delete a stock linked to the user in teh database */
  static async deleteStock(symbol) {
    let res = await this.request(`stocks`, { data: { symbol } }, {}, "DELETE");
    return res.deleted;
  }

  /** Add this stock to the user list in the database */
  static async addStock(symbol) {
    let res = await this.request(`stocks`, { data: { symbol } }, {}, "POST");
    return res.stock;
  }

  /** Search for stocks */
  static async searchStocks(term) {
    let res = await this.request(`stocks/search`, {}, { term: term }, "GET");
    return res.stocks;
  }

  /** Get updated currency exchange rate already registered by the user */
  static async getExchanges() {
    let res = await this.request(`exchanges`, {}, {}, "GET");
    return res.exchange_rates;
  }

  /** Get updated currency exchange rate already registered by the user */
  static async getExchange(currency1, currency2) {
    let res = await this.request(
      `exchanges`,
      {},
      { currency1, currency2 },
      "GET"
    );
    return res.exchange_rate;
  }

  /** Delete an exchange rate linked to the user in the database */
  static async deleteExchange(currency1, currency2) {
    let res = await this.request(
      `exchanges`,
      { data: { currency1, currency2 } },
      {},
      "DELETE"
    );
    return res.deleted;
  }

  /** Add this stock to the user list in the database */
  static async addExchange(currency1, currency2) {
    let res = await this.request(
      `exchanges`,
      { data: { currency1, currency2 } },
      {},
      "POST"
    );
    return res.exchange_rate;
  }

  /**Get currency codes available for exchange rate */
  static async getCurrencyCodes() {
    let res = await this.request(`exchanges/codes`, {}, {}, "GET");
    return res.supported_codes;
  }
}

export default ExpenseerAPI;
