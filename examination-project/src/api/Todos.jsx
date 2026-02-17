import axios from "axios";
import { data } from "react-router-dom";

const tasksApi = axios.create({
  baseURL: "https://api.oluwasetemi.dev",

});

// Interceptors to include access token in requests
tasksApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Get all tasks
export const getTasks = async (page = 1) => {
  const { data } = await tasksApi.get("/tasks", {
    params: {
      page,
      limit: 10,
    },
  });

  return data;
};

// Get single task
export const getTaskById = async (id) => {
  const { data } = await tasksApi.get(`/tasks/${id}`);
  return data;
};

// Create a new task
export const createTask = async (task) => {
  const { data } = await tasksApi.post("/tasks", task);
  return data;

};




// Update a task
export const updateTask = async (task) => {
  const { id, createdAt, updatedAt, ...payload } = task;

  const { data } = await tasksApi.patch(`/tasks/${id}`, payload);
  return data;
};


// Delete a task
export const deleteTask = async (id) => {
  const { data } = await tasksApi.delete(`/tasks/${id}`);
  return data;
};

