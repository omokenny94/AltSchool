import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetails from "./pages/TodoDetails";
import NotFound from "./pages/NotFound";
import CrashTest from "./pages/CrashTest";
import React from "react";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Profile from "./pages/Profile";
import Register from "./api/register";


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/crash" element={<CrashTest />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* <div className="container">
        <h2 className=" text-lg/8 font-semibold text-gray-900">
          Welcome back, Joseph
        </h2>

        <div className="task-area">
          <TaskHeader />
          <Search />

          <hr />

          <Tasks />
          <Tasks />
          <Tasks />
        </div>
      </div> */}
    </>
  );
}

export default App;
