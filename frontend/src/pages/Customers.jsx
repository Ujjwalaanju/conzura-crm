import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import API from "../services/api";

function Customers() {

  // STATES
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  // FILTER
  const [filterCompany, setFilterCompany] =
    useState("All");

  // SORT
  const [sortOrder, setSortOrder] =
    useState("Newest");

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const customersPerPage = 6;

  // EDIT STATE
  const [editingCustomer, setEditingCustomer] =
    useState(null);

  // FORM STATE
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });



  // LOAD CUSTOMERS
  const loadCustomers = async () => {

    try {

      const res = await API.get(
        "/customers"
      );

      setCustomers(res.data);

    } catch (err) {

      console.log(err);

    }

  };



  // USE EFFECT
  useEffect(() => {

  const fetchData = async () => {

    await loadCustomers();

  };

  fetchData();

}, []);



  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };



  // VALIDATION
  const validateForm = () => {

    if (
      !formData.name ||
      !formData.email ||
      !formData.company
    ) {

      alert(
        "Please fill required fields"
      );

      return false;

    }

    return true;

  };



  // ADD CUSTOMER
  const addCustomer = async () => {

    if (!validateForm()) return;

    try {

      const res = await API.post(
        "/customers",
        formData
      );

      setCustomers([
        ...customers,
        res.data,
      ]);

      alert(
        "Customer Added Successfully"
      );

      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
      });

    } catch (err) {

      console.log(err);

    }

  };



  // UPDATE CUSTOMER
  const updateCustomer = async () => {

    if (!validateForm()) return;

    try {

      const res = await API.put(
        `/customers/${editingCustomer._id}`,
        formData
      );

      setCustomers(

        customers.map((customer) =>

          customer._id === editingCustomer._id
            ? res.data
            : customer

        )

      );

      alert(
        "Customer Updated Successfully"
      );

      setEditingCustomer(null);

      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
      });

    } catch (err) {

      console.log(err);

    }

  };



  // DELETE CUSTOMER
  const deleteCustomer = async (id) => {

    try {

      await API.delete(
        `/customers/${id}`
      );

      setCustomers(

        customers.filter(
          (customer) =>
            customer._id !== id
        )

      );

      alert(
        "Customer Deleted"
      );

    } catch (err) {

      console.log(err);

    }

  };



  // SEARCH + FILTER
  let filteredCustomers =
    customers.filter((customer) => {

      const matchesSearch =

        customer.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        customer.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        customer.company
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCompany =

        filterCompany === "All"

          ? true

          : customer.company ===
            filterCompany;

      return (
        matchesSearch &&
        matchesCompany
      );

    });



  // SORT
  filteredCustomers.sort((a, b) => {

    if (sortOrder === "Newest") {

      return new Date(
        b.createdAt
      ) - new Date(a.createdAt);

    }

    if (sortOrder === "Oldest") {

      return new Date(
        a.createdAt
      ) - new Date(b.createdAt);

    }

    return 0;

  });



  // PAGINATION
  const indexOfLastCustomer =
    currentPage * customersPerPage;

  const indexOfFirstCustomer =
    indexOfLastCustomer -
    customersPerPage;

  const currentCustomers =
    filteredCustomers.slice(
      indexOfFirstCustomer,
      indexOfLastCustomer
    );

  const totalPages = Math.ceil(
    filteredCustomers.length /
    customersPerPage
  );



  return (

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-8 bg-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Customer Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer relationships
          </p>

        </div>

        {/* TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* FORM */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-6">

              {
                editingCustomer
                  ? "Edit Customer"
                  : "Add Customer"
              }

            </h2>

            <div className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Customer Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
              />

              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border"
              />

              <button

                onClick={
                  editingCustomer
                    ? updateCustomer
                    : addCustomer
                }

                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >

                {
                  editingCustomer
                    ? "Update Customer"
                    : "Add Customer"
                }

              </button>

            </div>

          </div>



          {/* STATS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-2xl shadow">

              <p className="text-gray-500">
                Total Customers
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mt-3">
                {customers.length}
              </h2>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow">

              <p className="text-gray-500">
                Companies
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mt-3">

                {
                  new Set(
                    customers.map(
                      (c) => c.company
                    )
                  ).size
                }

              </h2>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow">

              <p className="text-gray-500">
                Active Customers
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-green-600 mt-3">
                {customers.length}
              </h2>

            </div>

          </div>

        </div>



        {/* SEARCH FILTER SORT */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="p-3 rounded-xl border w-full md:w-80"
          />

          {/* FILTER */}
          <select
            value={filterCompany}
            onChange={(e) =>
              setFilterCompany(
                e.target.value
              )
            }
            className="p-3 rounded-xl border"
          >

            <option>All</option>

            {
              [
                ...new Set(
                  customers.map(
                    (c) => c.company
                  )
                ),
              ].map((company) => (

                <option key={company}>
                  {company}
                </option>

              ))
            }

          </select>

          {/* SORT */}
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value
              )
            }
            className="p-3 rounded-xl border"
          >

            <option>Newest</option>
            <option>Oldest</option>

          </select>

        </div>



        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {
            currentCustomers.map((customer) => (

              <div
                key={customer._id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >

                <h2 className="text-2xl font-bold text-gray-800">
                  {customer.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  {customer.company}
                </p>

                <p className="text-gray-500 mt-3 break-all">
                  {customer.email}
                </p>

                <p className="text-gray-500 mt-2">
                  {customer.phone}
                </p>

                <div className="mt-4">

                  <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full font-medium">
                    Active Customer
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">

                  <button

                    onClick={() => {

                      setEditingCustomer(customer);

                      setFormData({
                        name: customer.name,
                        company: customer.company,
                        email: customer.email,
                        phone: customer.phone,
                      });

                    }}

                    className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-xl hover:bg-blue-200"
                  >
                    Edit
                  </button>

                  <button

                    onClick={() =>
                      deleteCustomer(
                        customer._id
                      )
                    }

                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-xl hover:bg-red-200"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          }

        </div>



        {/* EMPTY */}
        {
          currentCustomers.length === 0 && (

            <div className="text-center text-gray-400 mt-16 text-lg">
              No customers found
            </div>

          )
        }



        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">

          <button

            disabled={currentPage === 1}

            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }

            className="bg-white px-5 py-2 rounded-xl shadow disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex items-center font-semibold">

            Page {currentPage} of {totalPages || 1}

          </div>

          <button

            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }

            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }

            className="bg-white px-5 py-2 rounded-xl shadow disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

    </div>

  );

}

export default Customers;