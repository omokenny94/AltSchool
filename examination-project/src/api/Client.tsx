import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.oluwasetemi.dev",
});

/* Attach token immediately on page load */
const token = localStorage.getItem("accessToken");
if (token) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

/* Function to update token after login/logout */
export function setAuthToken(newToken: null): void {
  if (newToken) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

export default apiClient;