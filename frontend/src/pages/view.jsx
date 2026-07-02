import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import toast from "react-hot-toast";

function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLead(res.data);
      } catch (error) {
        console.error("Error fetching lead details:", error);
        toast.error("Failed to load lead details");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  if (loading) {
    return (
      <div className="flex bg-gray-100 dark:bg-gray-950 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 flex justify-center items-center">
          <p className="text-xl font-bold dark:text-white">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex bg-gray-100 dark:bg-gray-950 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-red-600 font-bold text-xl">No lead data found</h2>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
            onClick={() => navigate("/leads")}
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 dark:bg-gray-955 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8">
        <h2 className="text-3xl font-black mb-6 dark:text-white">Lead Details</h2>

        <div className="bg-white dark:bg-gray-900 shadow-sm rounded-3xl p-8 space-y-4 max-w-2xl">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Name</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{lead.name}</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Email Address</span>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">{lead.email || "—"}</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Phone Number</span>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">{lead.phone || "—"}</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Project Title</span>
            <p className="text-lg text-gray-900 dark:text-white font-semibold mt-1">{lead.projectTitle || "—"}</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Purpose</span>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">{lead.purpose || "—"}</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Payment Amount</span>
            <p className="text-lg text-green-600 font-bold mt-1">₹ {lead.paymentAmount || 0}</p>
          </div>

          <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Remarks</span>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">{lead.remarks || "—"}</p>
          </div>

          <div className="pb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Pipeline Status</span>
            <div className="mt-2">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                lead.status === "Won" ? "bg-green-100 text-green-700" :
                lead.status === "Lost" ? "bg-red-100 text-red-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {lead.status || "New"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-3 rounded-2xl transition"
            onClick={() => navigate("/leads")}
          >
            Back to Leads
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition"
            onClick={() => navigate(`/payments/${lead._id}`, { state: { lead } })}
          >
            Convert to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default View;
