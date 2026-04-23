import React from "react";
import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-gray-600">Page not found.</p>

        <Link to="/" className="text-blue-600 underline">
          &larr; Go back home
        </Link>
      </div>
    </div>
  );
}