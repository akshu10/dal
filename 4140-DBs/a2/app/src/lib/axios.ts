import Axios from "axios";

const baseURL = "http://localhost:8080";

const axios = Axios.create({
  baseURL,
});

export default axios;
