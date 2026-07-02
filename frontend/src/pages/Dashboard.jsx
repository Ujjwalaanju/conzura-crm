import Sidebar from "../components/Sidebar";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Users,
  UserPlus,
  IndianRupee,
  Activity,
  Bell,
} from "lucide-react";


function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

 const [stats, setStats] = useState({
  totalLeads: 0,
  totalCustomers: 0,
  totalTasks: 0,
  totalTickets: 0,
  revenue: 0,
  conversionRate: 0,
  newLeads: 0,
  wonLeads: 0,
});

  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
  const [pendingProjectsCount, setPendingProjectsCount] = useState(0);

  const [todayBusiness, setTodayBusiness] = useState(0);
const [monthBusiness, setMonthBusiness] = useState(0);
const [totalBusiness, setTotalBusiness] = useState(0);

const [searchDate, setSearchDate] = useState("");
const [searchMonth, setSearchMonth] = useState("");
const [searchYear, setSearchYear] = useState("");

const [payments, setPayments] = useState([]);

  const loadLocalStats = () => {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    
    const completed = projects.filter(p => p.status === "Completed" || p.status === "Delivered").length;
    const pending = projects.filter(p => p.status === "In Progress" || !p.status).length;
    
    setCompletedProjectsCount(completed);
    setPendingProjectsCount(pending);

    const paymentData =
  JSON.parse(localStorage.getItem("payments")) || [];

setPayments(paymentData);

const today = new Date();

let todayTotal = 0;
let monthTotal = 0;
let grandTotal = 0;

paymentData.forEach((payment) => {

  const paid = Number(payment.paidAmount || 0);

  grandTotal += paid;

  if (payment.convertedAt) {

    const date = new Date(payment.convertedAt);

    if (
      date.toDateString() === today.toDateString()
    ) {
      todayTotal += paid;
    }

    if (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      monthTotal += paid;
    }
  }

});

setTodayBusiness(todayTotal);
setMonthBusiness(monthTotal);
setTotalBusiness(grandTotal);
};
  // LOAD DASHBOARD DATA
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await API.get("/reports");
        console.log("Dashboard API:", res.data);
setStats(res.data);
      } catch (error) {
        console.log(error);
      }
      loadLocalStats();
    };

    loadStats();

    const interval = setInterval(() => {
      loadStats();
    }, 2000);

    return () => clearInterval(interval);
  }, [user]);

const filteredPayments = payments.filter((payment) => {
  let matches = true;

  if (searchDate) {
    const selected = new Date(searchDate).toDateString();

    const converted =
      payment.convertedAt &&
      new Date(payment.convertedAt).toDateString() === selected;

    const history =
      payment.paymentHistory?.some(
        (item) =>
          new Date(item.date).toDateString() === selected
      );

    matches = matches && (converted || history);
  }

  if (searchMonth !== "") {
    const d = new Date(payment.convertedAt || payment.createdAt);

    matches = matches && d.getMonth() === Number(searchMonth);
  }

  if (searchYear !== "") {
    const d = new Date(payment.convertedAt || payment.createdAt);

    matches = matches && d.getFullYear() === Number(searchYear);
  }

  return matches;
});

  return (

    <div className="flex bg-gray-100 dark:bg-gray-950 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">

        {/* TOP BAR / HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm">
          {/* Left: Title & Welcome */}
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, {user?.name || "User"}!
            </p>
          </div>

          {/* Right: Search, Bell, Profile */}
          <div className="flex items-center flex-wrap gap-4 md:self-end">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search analytics..."
                className="pl-10 pr-4 py-2.5 w-64 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition"
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

            {/* Bell Icon */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 border border-gray-200 dark:border-gray-700 rounded-2xl transition"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black rounded-2xl flex items-center justify-center shadow-sm">
                {(user?.name || "U")[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">
                  {user?.role || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </div>

       {/* ================= KPI CARDS ================= */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  {/* Total Leads */}
  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500">Total Leads</p>
        <h2 className="text-4xl font-bold text-blue-600 mt-2">
          {stats.totalLeads}
        </h2>
      </div>

      <div className="bg-blue-100 p-4 rounded-2xl">
        <UserPlus size={28} className="text-blue-600" />
      </div>
    </div>
  </div>

  {/* Completed */}
  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500">Completed Projects</p>
        <h2 className="text-4xl font-bold text-green-600 mt-2">
          {completedProjectsCount}
        </h2>
      </div>

      <div className="bg-green-100 p-4 rounded-2xl">
        <Users size={28} className="text-green-600" />
      </div>
    </div>
  </div>

  {/* Pending */}
  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500">Pending Projects</p>
        <h2 className="text-4xl font-bold text-orange-600 mt-2">
          {pendingProjectsCount}
        </h2>
      </div>

      <div className="bg-orange-100 p-4 rounded-2xl">
        <Activity size={28} className="text-orange-600" />
      </div>
    </div>
  </div>

  {/* Won */}
  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500">Won Leads</p>
        <h2 className="text-4xl font-bold text-purple-600 mt-2">
          {stats.wonLeads}
        </h2>
      </div>

      <div className="bg-purple-100 p-4 rounded-2xl">
        <IndianRupee size={28} className="text-purple-600" />
      </div>
    </div>
  </div>

</div>

{/* ================= BUSINESS OVERVIEW ================= */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <p className="text-gray-500">Revenue</p>

    <h2 className="text-4xl font-bold text-green-600 mt-2">
      ₹{stats.revenue}
    </h2>
  </div>

  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <p className="text-gray-500">Today's Business</p>

    <h2 className="text-4xl font-bold text-blue-600 mt-2">
      ₹{todayBusiness}
    </h2>
  </div>

  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <p className="text-gray-500">Monthly Business</p>

    <h2 className="text-4xl font-bold text-orange-600 mt-2">
      ₹{monthBusiness}
    </h2>
  </div>

  <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
    <p className="text-gray-500">Total Business</p>

    <h2 className="text-4xl font-bold text-purple-600 mt-2">
      ₹{totalBusiness}
    </h2>
  </div>

</div>

{/* ================= BUSINESS SEARCH ================= */}

<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6 mb-8">

  <div className="flex items-center justify-between mb-6">

    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Business Search
    </h2>

    <button
      onClick={() => {
        setSearchDate("");
        setSearchMonth("");
        setSearchYear("");
      }}
      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
    >
      Reset
    </button>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

    {/* Date */}

    <input
      type="date"
      value={searchDate}
      onChange={(e) => setSearchDate(e.target.value)}
      className="border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800"
    />

    {/* Month */}

    <select
      value={searchMonth}
      onChange={(e) => setSearchMonth(e.target.value)}
      className="border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800"
    >

      <option value="">All Months</option>

      <option value="0">January</option>
      <option value="1">February</option>
      <option value="2">March</option>
      <option value="3">April</option>
      <option value="4">May</option>
      <option value="5">June</option>
      <option value="6">July</option>
      <option value="7">August</option>
      <option value="8">September</option>
      <option value="9">October</option>
      <option value="10">November</option>
      <option value="11">December</option>

    </select>

    {/* Year */}

    <input
      type="number"
      placeholder="Enter Year"
      value={searchYear}
      onChange={(e) => setSearchYear(e.target.value)}
      className="border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800"
    />

    {/* Summary */}

    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">

      <p className="text-gray-500 text-sm">

        Records

      </p>

      <h2 className="text-2xl font-bold text-blue-600">

        {filteredPayments.length}

      </h2>

    </div>

  </div>

</div>
{/* PAYMENT DETAILS */}

{/* ================= PAYMENT DETAILS ================= */}

<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6 mb-8">

  <div className="flex justify-between items-center mb-6">

    <div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">

        Payment Details

      </h2>

      <p className="text-gray-500">

        Business collected from converted projects

      </p>

    </div>

    <button
      onClick={() => navigate("/payments")}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
    >

      View All Payments

    </button>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="bg-blue-600 text-white">

          <th className="p-4">Customer</th>

          <th className="p-4">Project</th>

          <th className="p-4">Purpose</th>

          <th className="p-4">Total</th>

          <th className="p-4">Paid</th>

          <th className="p-4">Balance</th>

          <th className="p-4">Completion</th>

          <th className="p-4">Date</th>

        </tr>

      </thead>

      <tbody>

        {filteredPayments.length > 0 ? (

          filteredPayments.slice(0,5).map((payment)=>{

            const total =
              Number(payment.totalPayment || 5000);

            const paid =
              Number(payment.paidAmount || 0);

            const balance =
              total-paid;

            const percent =
              total>0
              ?Math.round((paid/total)*100)
              :0;

            return(

              <tr
                key={payment._id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >

                <td className="p-4 font-semibold">
                  {payment.name}
                </td>

                <td className="p-4">
                  {payment.projectTitle || "-"}
                </td>

                <td className="p-4">
                  {payment.purpose || "-"}
                </td>

                <td className="p-4">
                  ₹{total}
                </td>

                <td className="p-4 text-green-600 font-bold">
                  ₹{paid}
                </td>

                <td className="p-4 text-red-600 font-bold">
                  ₹{balance}
                </td>

                <td className="p-4">

                  <div className="w-40">

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                      <div

                        className={`h-3 rounded-full

                        ${
                          percent<=30
                          ?"bg-red-500"

                          :percent<=70
                          ?"bg-yellow-500"

                          :"bg-green-500"
                        }

                        `}

                        style={{
                          width:`${percent}%`
                        }}

                      ></div>

                    </div>

                    <p className="text-xs mt-1 font-semibold">

                      {percent}% Completed

                    </p>

                  </div>

                </td>

                <td className="p-4">

                  {

                    payment.convertedAt

                    ?

                    new Date(payment.convertedAt)

                    .toLocaleDateString()

                    :

                    "-"

                  }

                </td>

              </tr>

            )

          })

        ):(

          <tr>

            <td
              colSpan="8"
              className="text-center p-8 text-gray-500"
            >

              No Payments Found

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>
        {/* ================= RECENT ACTIVITY ================= */}

<div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6">

  <div className="flex justify-between items-center mb-6">

    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Recent Activity
    </h2>

    <span className="text-sm text-gray-500">
      Live Updates
    </span>

  </div>

  <div className="space-y-4">

    {/* Latest Lead */}

    <div className="flex justify-between items-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20">

      <div>

        <h3 className="font-bold">
          🆕 New Lead Added
        </h3>

        <p className="text-sm text-gray-500">
          {stats.newLeads} Pending Leads Available
        </p>

      </div>

      <span className="text-blue-600 font-bold">

        Pending

      </span>

    </div>

    {/* Won Leads */}

    <div className="flex justify-between items-center p-4 rounded-2xl bg-green-50 dark:bg-green-900/20">

      <div>

        <h3 className="font-bold">

          🎉 Lead Converted

        </h3>

        <p className="text-sm text-gray-500">

          {stats.wonLeads} Leads Converted Successfully

        </p>

      </div>

      <span className="text-green-600 font-bold">

        Won

      </span>

    </div>

    {/* Business */}

    <div className="flex justify-between items-center p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20">

      <div>

        <h3 className="font-bold">

          💰 Business Collected

        </h3>

        <p className="text-sm text-gray-500">

          ₹{todayBusiness} Collected Today

        </p>

      </div>

      <span className="text-purple-600 font-bold">

        Today

      </span>

    </div>

    {/* Projects */}

    <div className="flex justify-between items-center p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20">

      <div>

        <h3 className="font-bold">

          📁 Projects

        </h3>

        <p className="text-sm text-gray-500">

          {completedProjectsCount} Completed | {pendingProjectsCount} Pending

        </p>

      </div>

      <span className="text-orange-600 font-bold">

        Active

      </span>

    </div>

  </div>

</div>
      </div>

    </div>

  );

}

export default Dashboard;
  