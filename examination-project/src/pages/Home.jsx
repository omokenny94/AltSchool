import React, { useState, useEffect, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTasks, createTask, deleteTask, updateTask } from "../api/Todos";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const queryClient = useQueryClient();

  //Read User
  const { user } = useAuth();

  // Modal
  const [openModal, setOpenModal] = useState(false);

  // Search & filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  // Create form
  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");

  // ================= FETCH TASKS =================
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", page],
    queryFn: () => getTasks(page),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

 const allTasks = data?.data || [];

const tasks = allTasks.filter((task) => task.owner === user?.id);

  const meta = data?.meta || {};

  // ================= CREATE =================
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", page] });
      setNewTask("");
      setDescription("");
      setStatus("TODO");
    },
  });

  // ================= UPDATE (TOGGLE) =================
  const updateMutation = useMutation({
    mutationFn: updateTask,

    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", page] });

      const previous = queryClient.getQueryData(["tasks", page]);

      queryClient.setQueryData(["tasks", page], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
          ),
        };
      });

      return { previous };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks", page], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", page] });
    },
  });

  // Edit task function
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setNewTask(editingTask.name);
      setDescription(editingTask.description || "");
      setStatus(editingTask.status || "TODO");
      setOpenModal(true);
    }
  }, [editingTask]);

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", page] });
    },
  });

if (isLoading || !user) return <div className="p-6">Loading tasks...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Error loading tasks.</div>;

  // ================= FILTER DISPLAY ONLY =================
  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.status === "DONE") ||
      (filter === "incomplete" && task.status !== "DONE");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-2xl mx-auto ">
      <div className="flex justify-between items-center mb-6 vertical-center">
<h1 className="text-xl font-bold">
        {user ? `Welcome back ${user.name}` : "Welcome"}
      </h1>

      <Link
    to="/profile"
    className="text-sm underline text-blue-600"
  >
    Profile
  </Link>
        
      </div>
      
      
      <div className="task-area">
        <div className="flex justify-between items-center ">
          <h1 className="text-2xl font-bold mb-4 ">Tasks</h1>

          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="mb-6 px-4 py-2 bg-black text-white rounded"
          >
            + New Task
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full border rounded p-2 mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <hr />
        {/* FILTER */}
        <div className="flex gap-2 mb-4">
          {["all", "completed", "incomplete"].map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded border ${
                filter === type ? "bg-black text-white" : ""
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* TASK LIST */}
        <ul className="space-y-3">
          {visibleTasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white rounded-lg flex justify-between items-center shadow-sm"
            >
              <div>
                <Link to={`/tasks/${task.id}`} className="text-600  text-sm">
                  <p className="font-medium">{task.name}</p>
                </Link>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}

                <p className="text-sm">
                  {task.status === "DONE"
                    ? "Completed"
                    : task.status === "IN_PROGRESS"
                      ? "In Progress"
                      : task.status === "CANCELLED"
                        ? "Cancelled"
                        : "Todo"}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() =>
                    updateMutation.mutate({
                      ...task,
                      status: task.status === "DONE" ? "TODO" : "DONE",
                    })
                  }
                  className="text-sm px-2 py-1 border rounded"
                >
                  Toggle
                </button>

                <button
                  type="button"
                  onClick={() => setEditingTask(task)}
                  className="text-sm px-2 py-1 border rounded"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this task?")) {
                      deleteMutation.mutate(task.id);
                    }
                  }}
                  className="text-sm px-2 py-1 border rounded text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!meta.hasPreviousPage}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm font-medium">
          Page {meta.page} of {meta.totalPages}
        </span>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={!meta.hasNextPage}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? "Edit Task" : "Create Task"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTask.trim()) return;

                if (editingTask) {
                  updateMutation.mutate({
                    ...editingTask,
                    name: newTask,
                    description,
                    status,
                  });
                } else {
                  createMutation.mutate({
                    name: newTask,
                    description,
                    status,
                  });
                }

                setOpenModal(false);
                setEditingTask(null);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Task name..."
                className="w-full border rounded p-2"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />

              <textarea
                placeholder="Task description..."
                className="w-full border rounded p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <select
                className="w-full border rounded p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                    setEditingTask(null);
                    setNewTask("");
                    setDescription("");
                    setStatus("TODO");
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  {editingTask ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
