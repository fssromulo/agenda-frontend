import axios from "../../axios-config/axios-request-configs";

export async function get(url) {
  try {
    const apiData = await axios.get(`${url}`);

    return apiData;
  } catch (error) {
    console.error("Não foi possível efetuar a requisição.", error);
  }
}

export async function post(url, data) {
  try {
    const apiData = await axios.post(url, data);
    return apiData;
  } catch (error) {
    console.error("Não foi possível efetuar a requisição.", error);
  }
}
