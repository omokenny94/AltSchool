import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";


export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Checking session...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}