import {
  useEffect,
  useState
} from "react";

import axios
from "axios";

import Sidebar
from "../components/Sidebar";

import toast
from "react-hot-toast";

function Tickets() {

  const [tickets,
    setTickets] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [priorityFilter,
    setPriorityFilter] =
    useState("All");

  const [formData,
    setFormData] =
    useState({

      customerName: "",

      email: "",

      title: "",

      description: "",

      priority: "Medium",

      category: "General",

      assignedTo: "",

      slaDeadline: "",

      resolutionNotes: "",

    });

  // FETCH TICKETS
  const fetchTickets =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:5000/api/tickets"

          );

        setTickets(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  // LOAD
  useEffect(() => {

    const loadTickets =
      async () => {

        try {

          await fetchTickets();

        } catch (error) {

          console.log(error);

        }

      };

    loadTickets();

  }, []);

  // CREATE TICKET
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await axios.post(

          "http://localhost:5000/api/tickets",

          formData

        );
        await fetchTickets();

        toast.success(
          "Ticket Created"
        );

        setFormData({

          customerName: "",

          email: "",

          title: "",

          description: "",

          priority: "Medium",

          category: "General",

          assignedTo: "",

          slaDeadline: "",

          resolutionNotes: "",

        });

      } catch (error) {

        console.log(error);

      }

    };

  // DELETE
  const deleteTicket =
    async (id) => {

      try {

        await axios.delete(

          `http://localhost:5000/api/tickets/${id}`

        );
        await fetchTickets();

        toast.success(
          "Ticket Deleted"
        );


      } catch (error) {

        console.log(error);

      }

    };

  // STATUS UPDATE
  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        await axios.put(

          `http://localhost:5000/api/tickets/${id}`,

          { status }

        );
        await fetchTickets();

        toast.success(
          "Status Updated"
        );

      } catch (error) {

        console.log(error);

      }

    };

  // PRIORITY COLOR
  const getPriorityColor =
    (priority) => {

      switch (priority) {

        case "Low":
          return "text-green-600";

        case "Medium":
          return "text-yellow-600";

        case "High":
          return "text-orange-600";

        case "Critical":
          return "text-red-600";

        default:
          return "text-gray-600";

      }

    };

  // SLA CHECK
  const isSLABreached =
    (ticket) => {

      return (

        ticket.status !==
          "Resolved"

        &&

        ticket.slaDeadline

        &&

        new Date() >

        new Date(
          ticket.slaDeadline
        )

      );

    };

  // FILTER
  const filteredTickets =
    tickets.filter(
      (ticket) => {

        const matchesSearch =

  (ticket.customerName || "")
    .toLowerCase()
    .includes(
      search.toLowerCase()
    )

  ||

  (ticket.title || "")
    .toLowerCase()
    .includes(
      search.toLowerCase()
    );

        const matchesStatus =

          statusFilter === "All"

            ?

            true

            :

            ticket.status ===
            statusFilter;

        const matchesPriority =

          priorityFilter === "All"

            ?

            true

            :

            ticket.priority ===
            priorityFilter;

        return (

          matchesSearch

          &&

          matchesStatus

          &&

          matchesPriority

        );

      }
    );

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4 md:p-8 overflow-x-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl md:text-4xl font-black text-gray-900">

            Support Tickets

          </h1>

          <p className="text-gray-500 mt-2">

            Enterprise customer support system

          </p>

        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          <input
            type="text"
            placeholder="Search Tickets..."
            className="border border-gray-300 p-4 rounded-xl w-full md:w-96"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <select
            className="border border-gray-300 p-4 rounded-xl"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Open">
              Open
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>

            <option value="Closed">
              Closed
            </option>

          </select>

          <select
            className="border border-gray-300 p-4 rounded-xl"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Priority
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>

            <option value="Critical">
              Critical
            </option>

          </select>

        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Open Tickets

            </p>

            <h2 className="text-2xl md:text-3xl font-bold mt-2">

              {

                tickets.filter(
                  (t) =>
                    t.status ===
                    "Open"
                ).length

              }

            </h2>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Resolved

            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-green-600 mt-2">

              {

                tickets.filter(
                  (t) =>
                    t.status ===
                    "Resolved"
                ).length

              }

            </h2>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Critical Issues

            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-red-600 mt-2">

              {

                tickets.filter(
                  (t) =>
                    t.priority ===
                    "Critical"
                ).length

              }

            </h2>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              SLA Breaches

            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mt-2">

              {

                tickets.filter(
                  isSLABreached
                ).length

              }

            </h2>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow mb-10 grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          <input
            type="text"
            placeholder="Customer Name"
            className="border p-4 rounded-xl"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({

                ...formData,

                customerName:
                  e.target.value,

              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-4 rounded-xl"
            value={formData.email}
            onChange={(e) =>
              setFormData({

                ...formData,

                email:
                  e.target.value,

              })
            }
          />

          <input
            type="text"
            placeholder="Issue Title"
            className="border p-4 rounded-xl"
            value={formData.title}
            onChange={(e) =>
              setFormData({

                ...formData,

                title:
                  e.target.value,

              })
            }
          />

          <select
            className="border p-4 rounded-xl"
            value={formData.priority}
            onChange={(e) =>
              setFormData({

                ...formData,

                priority:
                  e.target.value,

              })
            }
          >

            <option>
              Low
            </option>

            <option>
              Medium
            </option>

            <option>
              High
            </option>

            <option>
              Critical
            </option>

          </select>

          <select
            className="border p-4 rounded-xl"
            value={formData.category}
            onChange={(e) =>
              setFormData({

                ...formData,

                category:
                  e.target.value,

              })
            }
          >

            <option>
              Technical
            </option>

            <option>
              Billing
            </option>

            <option>
              General
            </option>

            <option>
              Sales
            </option>

          </select>

          <input
            type="text"
            placeholder="Assign Support Executive"
            className="border p-4 rounded-xl"
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData({

                ...formData,

                assignedTo:
                  e.target.value,

              })
            }
          />

          <input
            type="date"
            className="border p-4 rounded-xl"
            value={formData.slaDeadline}
            onChange={(e) =>
              setFormData({

                ...formData,

                slaDeadline:
                  e.target.value,

              })
            }
          />

          <textarea
            placeholder="Description"
            className="border p-4 rounded-xl md:col-span-2"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({

                ...formData,

                description:
                  e.target.value,

              })
            }
          />

          <textarea
            placeholder="Resolution Notes"
            className="border p-4 rounded-xl md:col-span-2"
            rows={3}
            value={formData.resolutionNotes}
            onChange={(e) =>
              setFormData({

                ...formData,

                resolutionNotes:
                  e.target.value,

              })
            }
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl md:col-span-2 font-semibold transition"
          >

            Create Ticket

          </button>

        </form>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow overflow-x-auto">

          <table className="min-w-[1200px] w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-5 text-left">
                  Customer
                </th>

                <th className="p-5 text-left">
                  Issue
                </th>

                <th className="p-5 text-left">
                  Category
                </th>

                <th className="p-5 text-left">
                  Priority
                </th>

                <th className="p-5 text-left">
                  Assigned To
                </th>

                <th className="p-5 text-left">
                  Status
                </th>

                <th className="p-5 text-left">
                  SLA
                </th>

                <th className="p-5 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {

                filteredTickets.map(
                  (ticket) => (

                    <tr
                      key={ticket._id}
                      className={`border-t hover:bg-gray-50 ${
                        isSLABreached(ticket)
                          ? "bg-red-50"
                          : ""
                      }`}
                    >

                      <td className="p-5 font-semibold">

                        {
                          ticket.customerName
                        }

                      </td>

                      <td className="p-5">

                        {ticket.title}

                        {

                          ticket.comments?.length > 0 && (

                            <div className="mt-3 space-y-2">

                              {

                                ticket.comments.map(
                                  (
                                    comment,
                                    index
                                  ) => (

                                    <div
                                      key={index}
                                      className="bg-gray-100 p-2 rounded-lg text-sm"
                                    >

                                      {comment.text}

                                    </div>

                                  )
                                )
                              }

                            </div>

                          )
                        }

                      </td>

                      <td className="p-5">

                        {ticket.category}

                      </td>

                      <td className={`p-5 font-bold ${getPriorityColor(ticket.priority)}`}>

                        {ticket.priority}

                      </td>

                      <td className="p-5">

                        {

                          ticket.assignedTo ||

                          "Not Assigned"

                        }

                      </td>

                      <td className="p-5">

                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            updateStatus(

                              ticket._id,

                              e.target.value

                            )
                          }
                          className="border p-2 rounded-lg"
                        >

                          <option>
                            Open
                          </option>

                          <option>
                            In Progress
                          </option>

                          <option>
                            Resolved
                          </option>

                          <option>
                            Closed
                          </option>

                        </select>

                      </td>

                      <td className="p-5">

                        {

                          ticket.slaDeadline

                            ?

                            new Date(
                              ticket.slaDeadline
                            ).toLocaleDateString()

                            :

                            "N/A"

                        }

                      </td>

                      <td className="p-5">

                        <button
                          onClick={() =>
                            deleteTicket(
                              ticket._id
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                        >

                          Delete

                        </button>

                      </td>

                    </tr>

                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Tickets;