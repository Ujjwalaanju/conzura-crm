import { useEffect, useState } from "react";

import axios from "axios";

import Sidebar from "../components/Sidebar";

import toast from "react-hot-toast";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Pipeline() {

  const [leads, setLeads] =
    useState([]);

  // COLORS
  const COLORS = [
  "#F59E0B", // Pending
  "#10B981", // Won
];
  // FETCH LEADS
  const fetchLeads = async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const res = await axios.get(
        "http://localhost:5000/api/leads",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setLeads(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

  const loadLeads =
    async () => {

      await fetchLeads();

    };

  loadLeads();

}, []);

  // UPDATE STATUS
  const updateLeadStatus =
    async (id, status) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(

          `http://localhost:5000/api/leads/${id}`,

          { status },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

      } catch (error) {

        console.log(error);

      }

    };

  // DRAG
  const handleDragEnd =
    async (result) => {

      if (!result.destination)
        return;

      const leadId =
        result.draggableId;

      const newStatus =
        result.destination
          .droppableId;

      const updatedLeads =
        leads.map((lead) => {

          if (lead._id === leadId) {

            return {

              ...lead,

              status:
                newStatus,

            };

          }

          return lead;

        });

      setLeads(updatedLeads);

      await updateLeadStatus(
        leadId,
        newStatus
      );

      toast.success(
        `Lead moved to ${newStatus}`
      );

    };

  // PIPELINE DATA
  const pipelineData = [
  {
    name: "New",
    value: leads.filter(l => l.status === "New").length,
  },
  {
    name: "Won",
    value: leads.filter(l => l.status === "Won").length,
  },
];

  // REVENUE DATA
  const revenueData = [
  {
    stage: "New",
    revenue: leads.filter(l => l.status === "New").length * 50000,
  },
  {
    stage: "Won",
    revenue: leads.filter(l => l.status === "Won").length * 200000,
  },
];

  // FILTER
  const getLeadsByStatus =
    (status) => {

      return leads.filter(
        (lead) =>
          lead.status === status
      );

    };

  // PRIORITY COLORS
  const getPriorityColor =
    (priority) => {

      switch (priority) {

        case "High":
          return "text-red-600";

        case "Medium":
          return "text-yellow-600";

        case "Low":
          return "text-green-600";

        default:
          return "text-gray-600";

      }

    };

  // COLUMN COLORS
  const getColumnColor = (status) => {
  switch (status) {
    case "New":
      return "bg-blue-100";

    case "Won":
      return "bg-green-100";

    default:
      return "bg-gray-100";
  }
};

  const columns = [
  "New",
  "Won",
];

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 overflow-x-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-black text-gray-900">

            Sales Pipeline

          </h1>

          <p className="text-gray-500 mt-2">

            Drag and drop leads
            between stages

          </p>

        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* FUNNEL */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-6">

              Pipeline Funnel

            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >

                  {
                    pipelineData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={`cell-${index}`}
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

          {/* REVENUE */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-6">

              Revenue Forecast

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
                  fill="#3B82F6"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* KANBAN */}
        <DragDropContext
          onDragEnd={handleDragEnd}
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {
              columns.map(
                (status) => (

                  <Droppable
                    droppableId={status}
                    key={status}
                  >

                    {(provided) => (

                      <div

                        ref={
                          provided.innerRef
                        }

                        {
                          ...provided.droppableProps
                        }

                        className={`${getColumnColor(status)} rounded-3xl p-5 min-h-[600px]`}
                      >

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-5">

                          <h2 className="text-xl font-black text-gray-800">

                            {status}

                          </h2>

                          <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold">

                            {
                              getLeadsByStatus(
                                status
                              ).length
                            }

                          </div>

                        </div>

                        {/* LEADS */}
                        {
                          getLeadsByStatus(
                            status
                          ).map(
                            (
                              lead,
                              index
                            ) => (

                              <Draggable
                                key={lead._id}
                                draggableId={lead._id}
                                index={index}
                              >

                                {(provided) => (

                                  <div

                                    ref={
                                      provided.innerRef
                                    }

                                    {
                                      ...provided.draggableProps
                                    }

                                    {
                                      ...provided.dragHandleProps
                                    }

                                    className="bg-white rounded-2xl p-5 shadow-sm mb-4"
                                  >

                                    {/* NAME */}
                                    <h3 className="font-black text-lg text-gray-800">

                                      {lead.name}

                                    </h3>

                                    {/* COMPANY */}
                                    <p className="text-gray-500 mt-1">

                                      {lead.company}

                                    </p>

                                    {/* EMAIL */}
                                    <p className="text-sm text-gray-400 mt-2 break-all">

                                      {lead.email}

                                    </p>

                                    {/* PRIORITY */}
                                    <div className="mt-4 flex justify-between items-center">

                                      <span className={`font-semibold ${getPriorityColor(lead.priority)}`}>

                                        {
                                          lead.priority
                                        }

                                      </span>

                                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">

                                        Score:
                                        {" "}
                                        {
                                          lead.score
                                        }

                                      </span>

                                    </div>

                                    {/* DEAL VALUE */}
                                    <div className="mt-3 text-green-600 font-bold">

                                      ₹ {
                                        lead.dealValue
                                      }

                                    </div>

                                    {/* WIN */}
                                    <div className="mt-2 text-sm text-gray-500">

                                      Win Probability:
                                      {" "}

                                      {
                                        lead.winProbability
                                      }%

                                    </div>

                                    {/* FORECAST */}
                                    <div className="mt-2 text-sm text-blue-600 font-semibold">

                                      {
                                        lead.forecastCategory
                                      }

                                    </div>

                                    {/* CLOSE DATE */}
                                    <div className="mt-2 text-sm text-gray-500">

                                      Expected Close:
                                      {" "}

                                      {
                                        lead.expectedCloseDate

                                          ?

                                          new Date(
                                            lead.expectedCloseDate
                                          ).toLocaleDateString()

                                          :

                                          "N/A"
                                      }

                                    </div>

                                  </div>

                                )}

                              </Draggable>

                            )
                          )
                        }

                        {
                          provided.placeholder
                        }

                      </div>

                    )}

                  </Droppable>

                )
              )
            }

          </div>

        </DragDropContext>

      </div>

    </div>

  );

}

export default Pipeline;