import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import axios from "axios";

function Users() {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const role = user?.role || "";

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleInput, setRoleInput] = useState("Team Member");
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // FETCH USERS FROM BACKEND
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    if (role === "Admin" || role === "Team Manager" || role === "Team Leader") {
      fetchUsers();
    }
  }, [role]);

  // Restrict access for Team Member
  if (role !== "Admin" && role !== "Team Manager" && role !== "Team Leader") {
    return (
      <div className="flex bg-gray-100 dark:bg-gray-950 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-red-650 font-bold text-xl">Access Denied</h2>
        </div>
      </div>
    );
  }

  // CREATE USER (with API call)
  const createUser = async () => {
    if (!name || !email || !phone || !password) {
      toast.error("Please fill all fields, including password");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/users", {
        name,
        email,
        phone,
        password,
        role: roleInput,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User Account Created Successfully");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRoleInput("Team Member");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  // DELETE USER (with API call)
  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User Deleted");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  // EDIT SAVE (with API call)
  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${editData._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User Updated");
      setEditData(null);
      setEditIndex(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  };

  // RESET PASSWORD (Trigger)
  const triggerResetPassword = async (targetUser) => {
    try {
      const token = localStorage.getItem("token");
      // Trigger password reset token generation
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: targetUser.email
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Password reset token generated and logged for ${targetUser.email}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate reset link");
    }
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-955 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 mt-2">Manage roles, permissions and accounts for your team</p>
        </div>

        {/* CREATE USER FORM */}
        {(role === "Admin" || role === "Team Manager") && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm mb-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                className="border border-gray-200 dark:border-gray-700 p-3.5 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              <input 
                className="border border-gray-200 dark:border-gray-700 p-3.5 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Email Address" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <input 
                className="border border-gray-200 dark:border-gray-700 p-3.5 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Phone Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
              <input 
                className="border border-gray-200 dark:border-gray-700 p-3.5 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Password" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <select 
                className="border border-gray-200 dark:border-gray-700 p-3.5 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={roleInput} 
                onChange={(e) => setRoleInput(e.target.value)}
              >
                {role === "Admin" && <option value="Team Manager">Team Manager</option>}
                <option value="Team Leader">Team Leader</option>
                <option value="Team Member">Team Member</option>
              </select>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition md:col-span-2 shadow-sm" 
                onClick={createUser}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* SEARCH */}
        <div className="mb-6 relative max-w-md">
          <input 
            className="w-full border border-gray-200 dark:border-gray-700 pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
            placeholder="Search users..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <svg
            className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="p-5 font-bold text-sm">Name</th>
                <th className="p-5 font-bold text-sm">Email</th>
                <th className="p-5 font-bold text-sm">Phone</th>
                <th className="p-5 font-bold text-sm">Role</th>
                <th className="p-5 font-bold text-sm">Status</th>
                 {(role === "Admin" || role === "Team Manager") && <th className="p-5 font-bold text-sm text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => (u.name || "").toLowerCase().includes(search.toLowerCase()))
                .map((targetUser, index) => (
                  <tr key={targetUser._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 transition">
                    <td className="p-5 font-semibold text-gray-900 dark:text-white">{targetUser.name}</td>
                    <td className="p-5">{targetUser.email}</td>
                    <td className="p-5">{targetUser.phone || "—"}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        targetUser.role === "Team Manager" ? "bg-purple-100 text-purple-700" :
                        targetUser.role === "Team Leader" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {targetUser.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={targetUser.isActive !== false ? "text-green-600 font-bold text-sm" : "text-red-600 font-bold text-sm"}>
                        {targetUser.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                     {(role === "Admin" || role === "Team Manager") && (
                      <td className="p-5 flex gap-2 justify-center">
                        <button 
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition" 
                          onClick={() => triggerResetPassword(targetUser)}
                        >
                          Reset Password
                        </button>
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition" 
                          onClick={() => { setEditData(targetUser); setEditIndex(index); }}
                        >
                          Edit
                        </button>
                        <button 
                          className="bg-red-650 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition" 
                          onClick={() => deleteUser(targetUser._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={role === "Admin" || role === "Team Manager" ? 6 : 5} className="text-center text-gray-500 p-8">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* EDIT MODAL */}
        {editData && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800">
              <h3 className="text-2xl font-black mb-4 dark:text-white">Edit User Details</h3>
              
              <div className="space-y-4">
                <input 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={editData.name} 
                  placeholder="Full Name"
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })} 
                />
                <input 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={editData.email} 
                  placeholder="Email Address"
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
                />
                <input 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={editData.phone || ""} 
                  placeholder="Phone Number"
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })} 
                />
                <input 
                  className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="New Password (optional)"
                  type="password"
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })} 
                />
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">Role</label>
                    <select 
                      className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      value={editData.role} 
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    >
                      {role === "Admin" && <option value="Team Manager">Team Manager</option>}
                      <option value="Team Leader">Team Leader</option>
                      <option value="Team Member">Team Member</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 block mb-1">Status</label>
                    <select 
                      className="w-full border border-gray-200 dark:border-gray-700 p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      value={editData.isActive !== false ? "Active" : "Inactive"} 
                      onChange={(e) => setEditData({ ...editData, isActive: e.target.value === "Active" })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition" 
                  onClick={saveEdit}
                >
                  Save Changes
                </button>
                <button 
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition" 
                  onClick={() => setEditData(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
