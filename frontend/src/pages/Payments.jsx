import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payments.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Payments() {
  const location = useLocation();
  const lead = location.state?.lead;
  const navigate = useNavigate();

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const role = user?.role || "";

  const [payments, setPayments] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterDate, setFilterDate] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [amount, setAmount] = useState("");

  // Load payments from backend API
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const openHistoryModal = (payment) => {
    setSelectedPayment(payment);
    setShowHistoryModal(true);
  };

  // Update total payment in the database (Admins only)
  const updateTotalPayment = async (paymentId, val) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`http://localhost:5000/api/payments/${paymentId}`, {
        totalPayment: Number(val) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state
      const updatedPayments = payments.map((p) => (p._id === paymentId ? res.data : p));
      setPayments(updatedPayments);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update total payment");
    }
  };

  // Save payment transaction to the database (Pay)
  const savePayment = async () => {
    if (!amount || amount <= 0) {
      alert("Enter Valid Amount");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`http://localhost:5000/api/payments/${selectedPayment._id}/pay`, {
        amount: Number(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state
      const updatedPayments = payments.map((p) => (p._id === selectedPayment._id ? res.data : p));
      setPayments(updatedPayments);

      setAmount("");
      setShowPaymentModal(false);
      toast.success("Payment Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add payment");
    }
  };

  const exportExcel = () => {
    const dataToExport = filteredAndSortedPayments.map((p) => {
      const balance = (p.totalPayment || 5000) - (p.paidAmount || 0);
      return {
        "Student Name": p.name,
        "Conversion Date": p.convertedAt ? new Date(p.convertedAt).toLocaleDateString() : "—",
        "Total Payment (INR)": p.totalPayment || 5000,
        "Paid Amount (INR)": p.paidAmount || 0,
        "Remaining Amount (INR)": balance,
        "Purpose": p.purpose || "Internship",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(fileData, `Payments_Report_${filterDate || "All"}.xlsx`);
    toast.success("Excel Report Downloaded Successfully");
  };


  // Filter and sort payments
  const filteredAndSortedPayments = [...payments]
    .filter((payment) => {
      if (!filterDate) return true;
      
      const selDateStr = new Date(filterDate).toDateString();
      const convertedDateStr = payment.convertedAt ? new Date(payment.convertedAt).toDateString() : "";
      const matchConverted = convertedDateStr === selDateStr;
      
      const matchHistory = payment.paymentHistory?.some((item) => {
        return new Date(item.date).toDateString() === selDateStr;
      });
      
      return matchConverted || matchHistory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.convertedAt || a.createdAt || 0);
      const dateB = new Date(b.convertedAt || b.createdAt || 0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // PDF Generator for Payment Slip
  const downloadPaymentSlip = (payment) => {
    const doc = new jsPDF();
    
    // Header styling
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CONZURA CRM", 14, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Receipt / Slip", 14, 32);
    
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 25);
    
    // Student Details
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Student & Course Details", 14, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${payment.name}`, 14, 65);
    doc.text(`Email: ${payment.email || "—"}`, 14, 72);
    doc.text(`Phone: ${payment.phone || "—"}`, 14, 79);
    doc.text(`Project/Course: ${payment.projectTitle || "—"}`, 14, 86);
    doc.text(`Purpose: ${payment.purpose || "—"}`, 14, 93);
    
    // Payment Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary", 14, 110);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Course Fee: INR ${payment.totalPayment || 5000}`, 14, 120);
    doc.text(`Total Paid: INR ${payment.paidAmount || 0}`, 14, 127);
    doc.text(`Remaining Balance: INR ${(payment.totalPayment || 5000) - (payment.paidAmount || 0)}`, 14, 134);
    
    const balance = (payment.totalPayment || 5000) - (payment.paidAmount || 0);
    const statusStr = balance === 0 ? "PAID" : "PENDING";
    doc.setFont("helvetica", "bold");
    doc.text(`Status: ${statusStr}`, 14, 141);
    
    // Transaction Log Table
    if (payment.paymentHistory && payment.paymentHistory.length > 0) {
      doc.setFontSize(14);
      doc.text("Transaction History", 14, 155);
      
      const tableBody = payment.paymentHistory.map((item, index) => [
        index + 1,
        item.date,
        `INR ${item.amount}`
      ]);
      
      autoTable(doc, {
        startY: 160,
        head: [["S.No", "Date", "Paid Amount"]],
        body: tableBody,
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235] }
      });
    } else {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("No transaction history found.", 14, 155);
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text("Thank you for choosing Conzura.", 14, 285);
      doc.text(`Page ${i} of ${pageCount}`, 190, 285);
    }
    
    doc.save(`Payment_Slip_${payment.name.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">💳 Payments Management</h1>
            <p className="text-gray-500 mt-2">View and manage converted lead transactions</p>
          </div>

          {/* Sort & Filter options visible to everyone */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Filter by Date:</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-sm font-semibold text-blue-600 bg-transparent border-none outline-none cursor-pointer focus:ring-0 dark:text-blue-400"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="text-xs text-red-500 hover:text-red-700 font-bold ml-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Sort by Date:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-sm font-semibold text-blue-600 bg-transparent border-none outline-none cursor-pointer bg-white dark:bg-gray-900 dark:text-blue-400"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-2xl shadow-sm text-sm transition"
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* PAYMENTS TABLE */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="p-5 font-bold text-sm">Student Name</th>
                <th className="p-5 font-bold text-sm">Conversion Date</th>
                <th className="p-5 font-bold text-sm">Total Payment</th>
                <th className="p-5 font-bold text-sm">Paid Amount</th>
                <th className="p-5 font-bold text-sm">Remaining Amount</th>
                <th className="p-5 font-bold text-sm">Purpose</th>
                <th className="p-5 font-bold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPayments.map((payment) => (
                <tr key={payment._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 transition">
                  <td className="p-5 font-semibold text-gray-900 dark:text-white">{payment.name}</td>
                  <td className="p-5">{payment.convertedAt ? new Date(payment.convertedAt).toLocaleDateString() : "—"}</td>
                  <td className="p-5">
                    {role === "Admin" ? (
                      <input
                        type="number"
                        value={payment.totalPayment || 5000}
                        onChange={(e) => updateTotalPayment(payment._id, e.target.value)}
                        className="w-24 border border-gray-250 dark:border-gray-700 rounded-lg p-1 bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                      />
                    ) : (
                      <span>₹ {payment.totalPayment || 5000}</span>
                    )}
                  </td>
                  <td className="p-5 text-green-600 font-semibold">₹ {payment.paidAmount || 0}</td>
                  <td className="p-5 text-red-600 font-semibold">
                    ₹ {(payment.totalPayment || 5000) - (payment.paidAmount || 0)}
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                      {payment.purpose || "Internship"}
                    </span>
                  </td>
                  <td className="p-5 flex gap-2 flex-wrap">
                    <button 
                      onClick={() => openHistoryModal(payment)}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl text-xs font-bold transition"
                    >
                      History
                    </button>
                    <button 
                      onClick={() => openPaymentModal(payment)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Pay
                    </button>
                    <button 
                      onClick={() => downloadPaymentSlip(payment)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Download Slip
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAndSortedPayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-8">No payments recorded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-black mb-2 dark:text-white">Add Payment</h2>
            <p className="text-gray-500 mb-6">
              Remaining Balance: <span className="font-bold text-red-600">₹{(selectedPayment.totalPayment || 5000) - (selectedPayment.paidAmount || 0)}</span>
            </p>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 mb-6 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button 
                onClick={savePayment}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
              >
                Save
              </button>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl w-full max-w-lg my-8 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-black mb-6 dark:text-white">Payment Details & History</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Name</span>
                <p className="font-bold dark:text-white mt-0.5">{selectedPayment.name}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Email</span>
                <p className="font-bold dark:text-white mt-0.5 truncate">{selectedPayment.email || "—"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Phone</span>
                <p className="font-bold dark:text-white mt-0.5">{selectedPayment.phone || "—"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Project</span>
                <p className="font-bold dark:text-white mt-0.5">{selectedPayment.projectTitle || "—"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Purpose</span>
                <p className="font-bold dark:text-white mt-0.5">{selectedPayment.purpose || "—"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Total Price</span>
                <p className="font-bold dark:text-white mt-0.5">₹ {selectedPayment.totalPayment || 5000}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Paid Amount</span>
                <p className="font-bold text-green-600 mt-0.5">₹ {selectedPayment.paidAmount || 0}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                <span className="text-xs text-gray-400">Remaining Balance</span>
                <p className="font-bold text-red-600 mt-0.5">₹ {(selectedPayment.totalPayment || 5000) - (selectedPayment.paidAmount || 0)}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-3 dark:text-white">Transaction Log</h3>
            {selectedPayment.paymentHistory && selectedPayment.paymentHistory.length > 0 ? (
              <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayment.paymentHistory.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300">
                        <td className="p-3">{item.date}</td>
                        <td className="p-3 font-semibold">₹ {item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center">No transactions recorded yet.</p>
            )}
            <div className="mt-6 flex justify-between gap-3">
              <button 
                onClick={() => downloadPaymentSlip(selectedPayment)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition"
              >
                Download Slip
              </button>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
