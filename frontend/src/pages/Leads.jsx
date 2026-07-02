import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import toast from "react-hot-toast";


function Leads() 
{
  
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  const [currentPage, setCurrentPage] = useState(1);

  const leadsPerPage = 5;

 const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  projectTitle: "",
  remarks: "",
  payment: "",
  purpose: ""
});
// ✅ Add navigation hook here
  const navigate = useNavigate();



// ✅ Quick view
const handleView = (lead) => {
  navigate(`/view/${lead._id}`, { state: { lead } });
};

// ✅ Full details
const handleLeadDetails = (lead) => {
  navigate(`/lead-details/${lead._id}`, { state: { lead } });
};


// ✅ Add new lead submit handler
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const newLead = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    projectTitle: formData.projectTitle,
    purpose: formData.purpose,
    paymentAmount: Number(formData.payment) || 0,
  };

  try {

   await axios.post(
  "http://localhost:5000/api/leads",
  newLead,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
  

    toast.success("Lead added successfully");

    fetchLeads();

    setFormData({
      name: "",
      email: "",
      phone: "",
      projectTitle: "",
      purpose: "",
      payment: "",
    });

  } catch (error) {

    console.error(error);

    const message =
      error.response?.data?.message || "Error adding lead";

    toast.error(message);

  }
};

const handleConvert = async (lead) => {
  try {
    const token = localStorage.getItem("token");
    const id = lead._id;

    // Update lead status in backend (this automatically creates Customer, Project, and Payment records in MongoDB)
    await axios.put(
      `http://localhost:5000/api/leads/${id}`,
      { status: "Won" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Refresh leads list
    await fetchLeads();
    toast.success("Lead converted successfully");

    // ✅ Navigate to payments page
    navigate(`/payments`);

  }  catch (error) {
  console.error(error);

  toast.error(
    error.response?.data?.message ||
    "Error converting lead"
  );
}
};

  // FETCH USERS
  const fetchUsers = async () => {

    try
    {

      const token =
        localStorage.getItem("token");

      const res = await axios.get(

        "http://localhost:5000/api/auth/users",

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );

      setUsers(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // FETCH LEADS
  const fetchLeads = async () => {

    try {

      const token =
        localStorage.getItem("token");

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

  // LOAD
  useEffect(() => {

  const loadData = async () => {

    try {

      await Promise.all([

        fetchLeads(),

        fetchUsers(),

      ]);

    } catch (error) {

      console.log(error);

    }

  };

  loadData();

}, []);
  

  // FILTER
  let filteredLeads =
    leads.filter((lead) => {

      const matchesSearch =

        (lead.name || "")
  .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        (lead.company || "")
  .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =

        statusFilter === "All"

          ? true

          : lead.status ===
            statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );

    });

  // SORT
  filteredLeads.sort((a, b) => {

    if (sortOrder === "Newest") {

      return new Date(
        b.createdAt
      ) - new Date(a.createdAt);

    }

    return new Date(
      a.createdAt
    ) - new Date(b.createdAt);

  });

  // PAGINATION
  const indexOfLastLead =
    currentPage * leadsPerPage;

  const indexOfFirstLead =
    indexOfLastLead -
    leadsPerPage;

  const currentLeads =
    filteredLeads.slice(

      indexOfFirstLead,

      indexOfLastLead

    );

  const totalPages =
    Math.ceil(
      filteredLeads.length /
      leadsPerPage
    );

  // EXPORT PDF
  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "CRM Leads Report",
      14,
      15
    );

    autoTable(doc, {

      startY: 25,

      head: [[

        "Name",
        "Company",
        "Status",
        "Deal Value",

      ]],

      body:
        filteredLeads.map(
          (lead) => [

            lead.name,
            lead.company,
            lead.status,
            lead.dealValue,

          ]
        ),

    });

    doc.save(
      "CRM_Leads_Report.pdf"
    );

  };

  // EXPORT EXCEL
  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        filteredLeads
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Leads"

    );

    const excelBuffer =
      XLSX.write(workbook, {

        bookType: "xlsx",

        type: "array",

      });

    const fileData = new Blob(

      [excelBuffer],

      {

        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",

      }

    );

    saveAs(
      fileData,
      "CRM_Leads.xlsx"
    );

  };

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4 md:p-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold">

              Lead Management

            </h1>

            <p className="text-gray-500 mt-2">

              Enterprise CRM Pipeline

            </p>

          </div>

          <div className="flex flex-col md:flex-row flex-wrap gap-3">

            <button
              onClick={exportPDF}
              className="bg-red-500 text-white px-5 py-3 rounded-xl"
            >
              Export PDF
            </button>
            <select
  className="border border-gray-300 p-3 rounded-xl"
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

  <option value="New">
    New
  </option>

  <option value="Contacted">
    Contacted
  </option>

  <option value="Qualified">
    Qualified
  </option>

  <option value="Won">
    Won
  </option>

  <option value="Lost">
    Lost
  </option>

</select>
<select
  className="border border-gray-300 p-3 rounded-xl"
  value={sortOrder}
  onChange={(e) =>
    setSortOrder(
      e.target.value
    )
  }
>

  <option value="Newest">
    Newest
  </option>

  <option value="Oldest">
    Oldest
  </option>

</select>
            <input
  type="text"
  placeholder="Search Leads..."
  className="border border-gray-300 p-3 rounded-xl"
  value={search}
  onChange={(e) =>
    setSearch(
      e.target.value
    )
  }
/>

            <button
              onClick={exportExcel}
              className="bg-green-500 text-white px-5 py-3 rounded-xl"
            >
              Export Excel
            </button>

          </div>
        
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <p>Total Leads</p>

            <h2 className="text-3xl font-bold">

              {leads.length}

            </h2>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <p>Won Deals</p>

            <h2 className="text-3xl font-bold text-green-600">

              {
                leads.filter(
                  (lead) =>
                    lead.status === "Won"
                ).length
              }

            </h2>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <p>Revenue</p>

            <h2 className="text-3xl font-bold text-blue-600">

              ₹ {

                leads.reduce(

                  (acc, lead) =>

                    acc +
                    Number(
                      lead.dealValue || 0
                    ),

                  0

                )

              }

            </h2>

          </div>
           <div className="bg-white p-6 rounded-2xl shadow">

  <p>Conversion</p>

  <h2 className="text-3xl font-bold text-purple-600">
    {leads.length > 0
      ? Math.round(
          (leads.filter((lead) => lead.status === "Won").length /
            leads.length) * 100
        )
      : 0}
    %
  </h2>

</div>

</div>

<form
          
  onSubmit={handleSubmit}
  className="bg-white p-8 rounded-3xl shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-5"
>
  <input
    type="text"
    placeholder="Student Name"
    className="border p-4 rounded-xl"
    value={formData.name}
    onChange={(e) =>
      setFormData({ ...formData, name: e.target.value })
    }
  />

  <input
    type="email"
    placeholder="Email"
    className="border p-4 rounded-xl"
    value={formData.email}
    onChange={(e) =>
      setFormData({ ...formData, email: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Phone Number"
    className="border p-4 rounded-xl"
    value={formData.phone}
    onChange={(e) =>
      setFormData({ ...formData, phone: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Project Title"
    className="border p-4 rounded-xl"
    value={formData.projectTitle}
    onChange={(e) =>
      setFormData({ ...formData, projectTitle: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Remarks"
    className="border p-4 rounded-xl"
    value={formData.remarks}
    onChange={(e) =>
      setFormData({ ...formData, remarks: e.target.value })
    }
  />

  <input
    type="number"
    placeholder="Payment Amount"
    className="border p-4 rounded-xl"
    value={formData.payment}
    onChange={(e) =>
      setFormData({ ...formData, payment: e.target.value })
    }
  />

  <select
    className="border p-4 rounded-xl"
    value={formData.purpose}
    onChange={(e) =>
      setFormData({ ...formData, purpose: e.target.value })
    }
  >
    <option value="">Select Purpose</option>
    <option value="Internship">Internship</option>
    <option value="Project">Project</option>
    <option value="Training">Training</option>
  </select>

  <button
    className="bg-blue-600 text-white p-4 rounded-xl md:col-span-2"
  >
    Add Lead
  </button>
</form> 
   {/* TABLE */}
<div className="bg-white rounded-3xl shadow overflow-x-auto">
  <table className="min-w-[900px] w-full">
    <thead className="bg-blue-700 text-white">
      <tr>
        <th className="p-5 text-left">Name</th>
        <th className="p-5 text-left">Phone Number</th>
        <th className="p-5 text-left">Project Title</th>
        <th className="p-5 text-left">Payment</th>
        <th className="p-5 text-left">Status</th>
        <th className="p-5 text-left">Action</th>
      </tr>
    </thead>

    <tbody>
      {currentLeads.map((lead) => (
        <tr key={lead._id} className="border-t hover:bg-gray-100">
          <td className="p-5">{lead.name}</td>
          <td className="p-5">{lead.phone}</td>
          <td className="p-5">{lead.projectTitle}</td>
          <td className="p-5 text-green-600 font-semibold">
            ₹ {lead.paymentAmount || 0}
          </td>
          <td className="p-5">{lead.status || "New"}</td>
          <td className="p-5 flex gap-2">
           
            
<button
          onClick={() => handleView(lead)}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          View
        </button>

        
<button
  onClick={() => handleConvert(lead)}
  className="bg-blue-500 text-white px-4 py-2 rounded-xl"
>
  Convert
</button>

          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">

          <button
            disabled={
              currentPage === 1
            }
        
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
            className="bg-white px-5 py-2 rounded-xl shadow"
          >
            Previous
          </button>

          <div className="flex items-center font-semibold">

            Page {currentPage}
            {" "}
            of
            {" "}
            {totalPages || 1}

          </div>

          <button
            disabled={
              currentPage ===
                totalPages ||

              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
            className="bg-white px-5 py-2 rounded-xl shadow"
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );

}

export default Leads;
