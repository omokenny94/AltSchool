import axios from "axios";

const authApi = axios.create({
  baseURL: "https://api.oluwasetemi.dev",
});


authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Login
export const login = async (payload) => {
  const response = await authApi.post("/auth/login", payload);

  const { accessToken, refreshToken, user } = response.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return { user, accessToken, refreshToken };
};

//Register
export const register = async (payload) => {
  const { data } = await authApi.post("/auth/register", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await authApi.get("/auth/me");
  return data.user;
};

//Logout
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
