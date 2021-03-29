import axios from "axios";

const baseURL = "http://localhost:3333";
const objAxios = axios.create({ baseURL });

export default objAxios;
