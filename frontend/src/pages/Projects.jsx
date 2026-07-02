import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { toast } from "react-hot-toast";

function Project() {
  const location = useLocation();
  const lead = location.state?.lead;
  
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const role = user?.role || "";
  
  const [projects, setProjects] = useState([]);

  // Load projects on component mount
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Update specific fields of a project via backend API
  const updateProject = async (index, field, value) => {
    const project = projects[index];
    const token = localStorage.getItem("token");
    try {
      const updatedFields = { [field]: value };
      const res = await axios.put(`http://localhost:5000/api/projects/${project._id}`, updatedFields, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state locally
      const updatedProjects = [...projects];
      updatedProjects[index] = res.data;
      setProjects(updatedProjects);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar />
      
      <div className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">📁 Projects Management</h1>
          <p className="text-gray-500 mt-2">Track client projects, assignments, and delivery schedules</p>
        </div>

        {/* PROJECTS TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="p-5 font-bold text-sm">Student Name</th>
                  <th className="p-5 font-bold text-sm">Phone Number</th>
                  <th className="p-5 font-bold text-sm">Project Title</th>
                  <th className="p-5 font-bold text-sm">Balance Amount</th>
                  <th className="p-5 font-bold text-sm">Payment Status</th>
                  <th className="p-5 font-bold text-sm">Assigned To</th>
                  <th className="p-5 font-bold text-sm">Delivery Date</th>
                  <th className="p-5 font-bold text-sm">Completed (%)</th>
                  <th className="p-5 font-bold text-sm">Remarks</th>
                  <th className="p-5 font-bold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => {
                  const total = project.totalPayment || project.paymentAmount || 5000;
                  const paid = project.paidAmount || 0;
                  const balance = total - paid;
                  const isPaid = balance === 0;

                  return (
                     <tr 
                      key={index} 
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition"
                    >
                      {/* Name */}
                      <td className="p-5 font-semibold text-gray-900 dark:text-white">{project.name}</td>
                      
                      {/* Phone */}
                      <td className="p-5">{project.phone || "—"}</td>
                      
                      {/* Project Title */}
                      <td className="p-5 font-semibold text-blue-600 dark:text-blue-400">{project.projectTitle || "—"}</td>
                      
                      {/* Balance Fee */}
                      <td className={`p-5 font-semibold ${balance > 0 ? "text-red-650 dark:text-red-400" : "text-green-650"}`}>
                        ₹ {balance}
                      </td>
                      
                      {/* Payment Status Label */}
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPaid 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-450" 
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-450"
                        }`}>
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      
                      {/* Assigned Employee Input */}
                      <td className="p-4">
                        {role === "Admin" || role === "Team Manager" ? (
                          <input
                            type="text"
                            value={project.assignedTo || ""}
                            placeholder="Assign to..."
                            onChange={(e) => updateProject(index, "assignedTo", e.target.value)}
                            className="w-full text-xs border border-gray-250 dark:border-gray-600 rounded-lg p-2 bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{project.assignedTo || "—"}</span>
                        )}
                      </td>
                      
                      {/* Delivery Date Picker */}
                      <td className="p-4">
                        {role === "Admin" || role === "Team Manager" ? (
                          <input
                            type="date"
                            value={project.deliveryDate || ""}
                            onChange={(e) => updateProject(index, "deliveryDate", e.target.value)}
                            className="text-xs border border-gray-250 dark:border-gray-600 rounded-lg p-2 bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          />
                        ) : (
                          <span className="text-sm font-semibold">{project.deliveryDate || "—"}</span>
                        )}
                      </td>

                      {/* Completed (%) */}
                      <td className="p-4">
                        {role === "Admin" || role === "Team Manager" ? (
                          <select
                            value={project.completedPercent || 0}
                            onChange={(e) => updateProject(index, "completedPercent", Number(e.target.value))}
                            className="text-xs font-bold border border-gray-250 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                              <option key={val} value={val}>{val}%</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{project.completedPercent || 0}%</span>
                        )}
                      </td>
                      
                      {/* Remarks */}
                      <td className="p-5 text-sm max-w-xs truncate" title={project.remarks || ""}>
                        {project.remarks || "—"}
                      </td>
                      
                      {/* Project Status Dropdown */}
                      <td className="p-4">
                        {role === "Admin" || role === "Team Manager" ? (
                          <select
                            value={project.status || "In Progress"}
                            onChange={(e) => updateProject(index, "status", e.target.value)}
                            className="text-xs font-bold border border-gray-250 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            project.status === "Delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30" :
                            project.status === "Completed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30"
                          }`}>
                            {project.status || "In Progress"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center text-gray-500 dark:text-gray-400 p-8 italic">
                      No projects currently active
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;