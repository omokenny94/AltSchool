import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTasks, createTask, deleteTask, updateTask } from "../api/Todos";
import { useAuth } from "../context/AuthContext";
import { PaginatedTasks, Task, TaskStatus } from "../types";

// Helper for status labels
const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Completed",
  CANCELLED: "Cancelled",
};

export default function Home() {
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();

  // --- UI State ---
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");
  const [page, setPage] = useState(1);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // --- Form State ---
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");

  // Reset page on search/filter
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  // Sync form when editing
  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.name);
      setDescription(editingTask.description || "");
      setStatus(editingTask.status);
      setOpenModal(true);
    }
  }, [editingTask]);

  // --- Queries ---
  const { data, isLoading, isError } = useQuery<PaginatedTasks>({
    queryKey: ["tasks", page],
    queryFn: () => getTasks(page),
    // Only fetch if user is logged in *
    enabled: !!user,
  });

  const allTasks = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false };

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedTask: Partial<Task> & { id: string }) => {
      return updateTask(updatedTask as Task);
    },
    onMutate: async (updatedTask: Partial<Task> & { id: string }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", page] });
      const previous = queryClient.getQueryData<PaginatedTasks>(["tasks", page]);

      queryClient.setQueryData<PaginatedTasks>(["tasks", page], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks", page], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // --- Logic ---
  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setStatus("TODO");
    setEditingTask(null);
    setOpenModal(false);
  };

  if (authLoading) return <div className="p-6">Restoring session...</div>;
  if (!user) return <div className="p-6">Please log in to view tasks.</div>;
  if (isLoading) return <div className="p-6">Loading tasks...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading tasks.</div>;

  const visibleTasks = allTasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.status === "DONE") ||
      (filter === "incomplete" && task.status !== "DONE");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Welcome back, {user.name}</h1>
        <Link to="/profile" className="text-sm underline text-blue-600">Profile</Link>
      </header>

      <section className="task-area">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tasks</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            + New Task
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full border rounded p-2 mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2 mb-4">
          {(["all", "completed", "incomplete"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded border capitalize ${filter === type ? "bg-black text-white" : ""}`}
            >
              {type}
            </button>
          ))}
        </div>

        <ul className="space-y-3">
          {visibleTasks.map((task) => (
            <li key={task.id} className="p-4 bg-white rounded-lg flex justify-between items-center shadow-sm border">
              <div>
                <Link to={`/tasks/${task.id}`} className="font-medium hover:text-blue-600">
                  {task.name}
                </Link>
                {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{STATUS_LABELS[task.status]}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => updateMutation.mutate({
                    id: task.id, status: task.status === "DONE" ? "TODO" : "DONE",
                    name: task.name,
                    description: task.description,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt
                  })}
                  className="text-sm px-2 py-1 border rounded"
                >
                  Toggle
                </button>
                <button onClick={() => setEditingTask(task)} className="text-sm px-2 py-1 border rounded">
                  Edit
                </button>
                <button
                  onClick={() => confirm("Delete?") && deleteMutation.mutate(task.id)}
                  className="text-sm px-2 py-1 border rounded text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Pagination Controls */}
      <footer className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!meta.hasPreviousPage}
          className="px-3 py-1 border rounded disabled:opacity-30"
        >
          Prev
        </button>
        <span className="text-sm">Page {meta.page} of {meta.totalPages}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!meta.hasNextPage}
          className="px-3 py-1 border rounded disabled:opacity-30"
        >
          Next
        </button>
      </footer>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{editingTask ? "Edit Task" : "Create Task"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const payload = { name: taskName, description, status };
                editingTask 
                  ? updateMutation.mutate({
                    ...payload, id: editingTask.id,
                    createdAt: editingTask.createdAt,
                    updatedAt: editingTask.updatedAt
                  }) 
                  : createMutation.mutate(payload);
              }}
              className="space-y-3"
            >
              <input
                required
                className="w-full border rounded p-2"
                placeholder="Task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <textarea
                className="w-full border rounded p-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <select
                className="w-full border rounded p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                  {editingTask ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}