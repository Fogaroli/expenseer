import axios from "axios";

const BASE_URL = import.meta.env.VITE_EXPENSEER_API_URL;

class ExpenseerAPI {
  // the JWT for interactive with the API will be stored here.
  static token;

  /** Static function to send HTTP requests  */
  static async request({ endpoint, data = {}, params = {}, method = "get" }) {
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
    let res = await this.request({
      endpoint: `auth/register`,
      data: data,
      method: "POST",
    });
    return res;
  }

  /** Post request for user login */

  static async login(credentials) {
    let res = await this.request({
      endpoint: `auth/login`,
      data: credentials,
      method: "POST",
    });
    return res;
  }

  /** Get User information for given valid JWT */

  static async getUser(username) {
    let res = await this.request({
      endpoint: `users/${username}`,
    });
    return res.user;
  }
}

export default ExpenseerAPI;
