import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "../api/Todos";

function TaskDetails() {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-6">Loading task details...</div>;
  }

  if (isError) {
    return (
      <div className="p-6">
        Failed to load task details. Please try again later.
      </div>
    );
  }

  const task = data;

  if (!task) {
    return <div className="p-6">Task not found.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back button */}

      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to List
      </Link>

      <div className="border rounded-lg p-6 space-y-3 todo-details">
        <h2 className="text-2xl font-bold">{task.title}</h2>

        <p
          className={`text ${task.completed ? "text-green-600" : "text-gray-500"}`}
        >
          {task.completed ? "Completed" : "Pending"}
        </p>

        {/* Additional details */}

        {task.description && (
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-gray-700">{task.description}</p>
          </div>
        )}

        {task.createdAt && (
          <p className="text-sm text-gray-500">
            Created At: {new Date(task.createdAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
