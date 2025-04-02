import axios from "axios";

const API = axios.create({
  baseURL: "http://221.156.215.197:5030/",
  withCredentials: false,
});

export default API;
