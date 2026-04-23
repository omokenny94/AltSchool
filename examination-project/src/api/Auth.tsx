import apiClient, { setAuthToken } from "./Client";




export const login = async (payload: { email: string; password: string; }) => {
  const { data } = await apiClient.post("/auth/login", payload);

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  setAuthToken(data.accessToken);

  return data;
};

export const register = async (payload: { name: string; email: string; password: string; }) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  setAuthToken(null);
};