import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import API from "../services/api";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import * as XLSX from "xlsx";

import { saveAs }
from "file-saver";

function Reports() {

  const [leads, setLeads] =
    useState([]);

  const [customers,
    setCustomers] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  // COLORS
 const COLORS = [
  "#3B82F6", // New
  "#10B981", // Won
];

  // FETCH DATA
  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const leadsRes =
            await API.get(
              "/leads"
            );

          const customerRes =
            await API.get(
              "/customers"
            );

          const taskRes =
            await API.get(
              "/tasks"
            );

          setLeads(
            leadsRes.data
          );

          setCustomers(
            customerRes.data
          );

          setTasks(
            taskRes.data
          );

        } catch (error) {

          console.log(error);

        }

      };

    fetchData();

  }, []);

  // KPI CALCULATIONS

  const totalRevenue =
    leads

    .filter(
      (lead) =>
        lead.status === "Won"
    )

    .reduce(
      (acc, lead) =>

        acc +
        Number(lead.paymentAmount || 0),

      0
    );

  const wonDeals =
    leads.filter(
      (lead) =>
        lead.status === "Won"
    ).length;

  const conversionRate =
    leads.length > 0

      ?

      Math.round(

        (
          wonDeals /
          leads.length
        ) * 100

      )

      :

      0;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  const productivityRate =
    tasks.length > 0

      ?

      Math.round(

        (
          completedTasks /
          tasks.length
        ) * 100

      )

      :

      0;

  // LEAD CONVERSION
  const leadData = [
  {
    name: "New",
    value: leads.filter(
      (lead) => lead.status === "New"
    ).length,
  },
  {
    name: "Won",
    value: leads.filter(
      (lead) => lead.status === "Won"
    ).length,
  },
];

  // REVENUE DATA
  const revenueData = [
  {
    stage: "New",
    revenue: leads
      .filter((lead) => lead.status === "New")
      .reduce(
        (sum, lead) => sum + Number(lead.paymentAmount || 0),
        0
      ),
  },
  {
    stage: "Won",
    revenue: leads
      .filter((lead) => lead.status === "Won")
      .reduce(
        (sum, lead) => sum + Number(lead.paymentAmount || 0),
        0
      ),
  },
];

  // EXPORT PDF
  const exportPDF = () => {

    const doc =
      new jsPDF();

    doc.text(
      "CRM Business Report",
      14,
      15
    );

    autoTable(doc, {

      startY: 25,

      head: [[

        "Metric",

        "Value",

      ]],

      body: [

        [
          "Revenue",
          `₹ ${totalRevenue}`,
        ],

        [
          "Won Deals",
          wonDeals,
        ],

        [
          "Conversion Rate",
          `${conversionRate}%`,
        ],

        [
          "Customers",
          customers.length,
        ],

        [
          "Productivity",
          `${productivityRate}%`,
        ],

      ],

    });

    doc.save(
      "CRM_Report.pdf"
    );

  };

  // EXPORT EXCEL
  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet([

        {
          Revenue:
            totalRevenue,

          WonDeals:
            wonDeals,

          ConversionRate:
            conversionRate,

          Customers:
            customers.length,

          Productivity:
            productivityRate,

        },

      ]);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Reports"

    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType:
            "xlsx",

          type: "array",
        }
      );

    const fileData =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

    saveAs(
      fileData,
      "CRM_Report.xlsx"
    );

  };

  // MONTHLY LEADS
const monthlyLeadData = Array.from(
  { length: 12 },
  (_, index) => ({
    month: new Date(
      2026,
      index
    ).toLocaleString(
      "default",
      {
        month: "short",
      }
    ),

    leads: leads.filter((lead) => {
      const date =
        new Date(
          lead.createdAt
        );

      return (
        date.getMonth() ===
        index
      );
    }).length,
  })
);

// MONTHLY REVENUE
const monthlyRevenueData =
  Array.from(
    { length: 12 },
    (_, index) => ({
      month: new Date(
        2026,
        index
      ).toLocaleString(
        "default",
        {
          month: "short",
        }
      ),

      revenue: leads
        .filter(
          (lead) =>
            lead.status ===
              "Won" &&
            new Date(
              lead.createdAt
            ).getMonth() ===
              index
        )
        .reduce(
          (sum, lead) =>
            sum +
            Number(
              lead.paymentAmount ||
                0
            ),
          0
        ),
    })
  );

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 overflow-x-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">

          <div>

            <h1 className="text-4xl font-black text-gray-800">

              Reports & Analytics

            </h1>

            <p className="text-gray-500 mt-2">

              Real-time business intelligence dashboard

            </p>

          </div>

          <div className="flex gap-4 mt-5 md:mt-0">

            <button
              onClick={exportPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
            >

              Export PDF

            </button>

            <button
              onClick={exportExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
            >

              Export Excel

            </button>

          </div>

        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">

          {/* REVENUE */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Total Revenue

            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">

              ₹ {totalRevenue}

            </h2>

          </div>

          {/* WON */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Won Deals

            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">

              {wonDeals}

            </h2>

          </div>

          {/* CONVERSION */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Conversion Rate

            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">

              {conversionRate}%

            </h2>

          </div>

          {/* CUSTOMERS */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Customers

            </p>

            <h2 className="text-3xl font-bold text-orange-600 mt-2">

              {customers.length}

            </h2>

          </div>

          {/* PRODUCTIVITY */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Productivity

            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">

              {productivityRate}%

            </h2>

          </div>

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* REVENUE */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-6">

              Revenue Analytics

            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={revenueData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="stage"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="revenue"
                  fill="#10B981"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* LEAD CONVERSION */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-6">

              Lead Conversion

            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={leadData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  {
                    leadData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* SECOND CHARTS */}
        {/* MONTHLY CHARTS */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

  {/* Monthly Leads */}
  <div className="bg-white p-6 rounded-2xl shadow">

    <h2 className="text-2xl font-bold mb-6">
      Monthly Lead Growth
    </h2>

    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={monthlyLeadData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="#3B82F6"
          fill="#BFDBFE"
        />
      </AreaChart>
    </ResponsiveContainer>

  </div>

  {/* Monthly Revenue */}
  <div className="bg-white p-6 rounded-2xl shadow">

    <h2 className="text-2xl font-bold mb-6">
      Monthly Revenue Trend
    </h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyRevenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="revenue"
          fill="#10B981"
        />
      </BarChart>
    </ResponsiveContainer>

  </div>

</div>

        </div>

      </div>

  );

}

export default Reports;