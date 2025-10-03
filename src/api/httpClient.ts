import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000", // replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiGet = async (url: string, params = {}) => {
  try {
    const response = await http.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const apiPost = async (url:string, data = {}) => {
  try {
    const response = await http.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default http;
