import { ReactNode } from "react";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

export interface Task {
  completed: any;
  title: ReactNode;
  id: string;
  name: string;
  description?: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTasks {
  data: Task[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}