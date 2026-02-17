import { useAuth } from "../context/AuthContext";
import { logout } from "../api/Auth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link, useParams } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      
      <div>
<Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Home
      </Link>
        
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      </div>

      
      <div className="border rounded-lg p-6 space-y-4 profile">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Member Since</p>
          <p className="font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
