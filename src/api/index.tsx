import axios from "axios";

const API = axios.create({
  baseURL: "http://119.219.30.209:6030/",
  withCredentials: false,
});

export default API;
