import apiClient from "../api/Client";

export const getTasks = async (page = 1) => {
  const { data } = await apiClient.get("/tasks", {
    params: { page, limit: 10 },
  });
  return data;
};

export const createTask = async (task) => {
  const { data } = await apiClient.post("/tasks", task);
  return data;
};

export const updateTask = async (task) => {
  const { data } = await apiClient.patch(`/tasks/${task.id}`, task);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await apiClient.delete(`/tasks/${id}`);
  return data;
};

export const getTaskById = async (id) => {
  const { data } = await apiClient.get(`/tasks/${id}`);
  return data;
};