import apiClient from "./Client";
import { PaginatedTasks, Task } from "../types";

export const getTasks = async (page = 1): Promise<PaginatedTasks> => {
  const { data } = await apiClient.get("/tasks", {
    params: { page, limit: 10 },
  });
  return data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const { data } = await apiClient.get(`/tasks/${id}`);
  return data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const { data } = await apiClient.post("/tasks", task);
  return data;
};

export const updateTask = async (task: Task): Promise<Task> => {
  const { data } = await apiClient.patch(`/tasks/${task.id}`, task);
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};