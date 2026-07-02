import Sidebar from "../components/Sidebar";

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../services/api";

function CustomerDetails() {

  const { id } = useParams();

  const [customer, setCustomer] =
    useState(null);

  const [note, setNote] =
    useState("");

  const [interaction, setInteraction] =
    useState("");

  const [interactionType, setInteractionType] =
    useState("Call");

    const [selectedFile,
  setSelectedFile] =
  useState(null);

  // LOAD CUSTOMER
  useEffect(() => {

    const loadCustomer =
      async () => {

        try {

          const res =
            await API.get(

              `/customers/${id}`

            );

          setCustomer(
            res.data
          );

        } catch (err) {

          console.log(err);

        }

      };

    loadCustomer();

  }, [id]);

  // ADD NOTE
  const addNote = async () => {

    if (!note.trim()) return;

    try {

      const res =
        await API.post(

          `/customers/${id}/notes`,

          {
            text: note,
          }

        );

      setCustomer(
        res.data
      );

      setNote("");

    } catch (err) {

      console.log(err);

    }

  };

  // ADD INTERACTION
  const addInteraction =
    async () => {

      if (
        !interaction.trim()
      ) return;

      try {

        const updatedCustomer = {

          ...customer,

          interactions: [

            ...(customer.interactions || []),

            {

              type:
                interactionType,

              message:
                interaction,

              createdAt:
                new Date(),

            },

          ],

        };

        await API.put(

          `/customers/${id}`,

          updatedCustomer

        );

        setCustomer(
          updatedCustomer
        );

        setInteraction("");

      } catch (err) {

        console.log(err);

      }

    };
    
  // LOADING
  if (!customer) {

    return (

      <div className="p-10 text-2xl">

        Loading...

      </div>

    );

  }
  // UPLOAD FILE
const uploadFile =
  async () => {

    if (!selectedFile)
      return;

    try {

      const formData =
        new FormData();

      formData.append(

        "file",

        selectedFile

      );

      const res =
        await API.post(

          `/customers/${id}/upload`,

          formData,

          {

            headers: {

              "Content-Type":
                "multipart/form-data",

            },

          }

        );

      setCustomer(
        res.data
      );

      setSelectedFile(null);

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-bold text-gray-800">

                {customer.name}

              </h1>

              <p className="text-gray-500 mt-2">

                Customer Profile Details

              </p>

            </div>

            <div>

              <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-medium">

                {
                  customer.lifecycleStage
                }

              </span>

            </div>

          </div>

        </div>

        {/* PROFILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CUSTOMER INFO */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">

              Customer Information

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}
              <div>

                <p className="text-gray-500 text-sm">
                  Full Name
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-2">

                  {customer.name}

                </h3>

              </div>

              {/* COMPANY */}
              <div>

                <p className="text-gray-500 text-sm">
                  Company
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-2">

                  {customer.company}

                </h3>

              </div>

              {/* EMAIL */}
              <div>

                <p className="text-gray-500 text-sm">
                  Email
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mt-2 break-all">

                  {customer.email}

                </h3>

              </div>

              {/* PHONE */}
              <div>

                <p className="text-gray-500 text-sm">
                  Phone
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-2">

                  {customer.phone}

                </h3>

              </div>

              {/* SEGMENT */}
              <div>

                <p className="text-gray-500 text-sm">
                  Customer Segment
                </p>

                <h3 className="text-xl font-semibold text-blue-600 mt-2">

                  {customer.segment}

                </h3>

              </div>

              {/* LIFECYCLE */}
              <div>

                <p className="text-gray-500 text-sm">
                  Lifecycle Stage
                </p>

                <h3 className="text-xl font-semibold text-green-600 mt-2">

                  {customer.lifecycleStage}

                </h3>

              </div>

              {/* PURCHASES */}
              <div>

                <p className="text-gray-500 text-sm">
                  Total Purchases
                </p>

                <h3 className="text-xl font-semibold text-purple-600 mt-2">

                  ₹ {customer.totalPurchases}

                </h3>

              </div>

              {/* CREATED */}
              <div>

                <p className="text-gray-500 text-sm">
                  Customer Since
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mt-2">

                  {
                    new Date(
                      customer.createdAt
                    ).toLocaleDateString()
                  }

                </h3>

              </div>

            </div>

          </div>

          {/* QUICK STATS */}
          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">

              Quick Stats

            </h2>

            <div className="space-y-5">

              <div className="bg-blue-50 p-4 rounded-xl">

                <p className="text-gray-500 text-sm">
                  Notes Added
                </p>

                <h3 className="text-3xl font-bold text-blue-600 mt-2">

                  {
                    customer.notes?.length || 0
                  }

                </h3>

              </div>

              <div className="bg-green-50 p-4 rounded-xl">

                <p className="text-gray-500 text-sm">
                  Interactions
                </p>

                <h3 className="text-3xl font-bold text-green-600 mt-2">

                  {
                    customer.interactions?.length || 0
                  }

                </h3>

              </div>

              <div className="bg-purple-50 p-4 rounded-xl">

                <p className="text-gray-500 text-sm">
                  Segment
                </p>

                <h3 className="text-2xl font-bold text-purple-600 mt-2">

                  {customer.segment}

                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* NOTES */}
        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            Customer Notes

          </h2>

          {/* ADD NOTE */}
          <div className="flex gap-4 mb-8">

            <input
              type="text"
              placeholder="Add customer note..."
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
              className="flex-1 p-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={addNote}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-semibold transition"
            >

              Add Note

            </button>

          </div>

          {/* NOTES LIST */}
          <div className="space-y-4">

            {
              customer.notes?.length > 0

              ?

              customer.notes.map(

                (
                  noteItem,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-gray-100 p-5 rounded-xl"
                  >

                    <p className="text-gray-700 text-lg">

                      {noteItem.text}

                    </p>

                    <p className="text-sm text-gray-500 mt-3">

                      {
                        new Date(
                          noteItem.createdAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>

                )

              )

              :

              <div className="text-gray-400 text-center py-10">

                No notes added yet

              </div>
            }

          </div>

        </div>

        {/* INTERACTIONS */}
        <div className="bg-white rounded-2xl shadow p-6 mt-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            Communication History

          </h2>

          {/* ADD INTERACTION */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">

            <select
              value={interactionType}
              onChange={(e) =>
                setInteractionType(
                  e.target.value
                )
              }
              className="p-4 rounded-xl border border-gray-300"
            >

              <option>Call</option>

              <option>Email</option>

              <option>Meeting</option>

              <option>WhatsApp</option>

            </select>

            <input
              type="text"
              placeholder="Add interaction..."
              value={interaction}
              onChange={(e) =>
                setInteraction(
                  e.target.value
                )
              }
              className="flex-1 p-4 rounded-xl border border-gray-300"
            />

            <button
              onClick={addInteraction}
              className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl font-semibold"
            >

              Add

            </button>

          </div>
          {/* ATTACHMENTS */}
<div className="bg-white rounded-2xl shadow p-6 mt-8">

  <h2 className="text-2xl font-bold text-gray-800 mb-6">

    Documents & Attachments

  </h2>

  {/* UPLOAD */}
  <div className="flex flex-col md:flex-row gap-4 mb-8">

    <input
      type="file"
      onChange={(e) =>
        setSelectedFile(
          e.target.files[0]
        )
      }
      className="border border-gray-300 p-3 rounded-xl"
    />

    <button
      onClick={uploadFile}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-semibold"
    >

      Upload File

    </button>

  </div>

  {/* FILE LIST */}
  <div className="space-y-4">

    {
      customer.attachments?.length > 0

      ?

      customer.attachments.map(

        (file, index) => (

          <div
            key={index}
            className="bg-gray-100 p-5 rounded-xl flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold text-gray-800">

                {file.fileName}

              </h3>

            </div>

            <a

              href={`http://localhost:5000${file.fileUrl}`}

              target="_blank"

              rel="noreferrer"

              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
            >

              View

            </a>

          </div>

        )

      )

      :

      <div className="text-gray-400 text-center py-10">

        No attachments uploaded

      </div>
    }

  </div>

</div>

          {/* INTERACTION LIST */}
          <div className="space-y-4">

            {
              customer.interactions?.length > 0

              ?

              customer.interactions.map(

                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-gray-100 p-5 rounded-xl"
                  >

                    <div className="flex justify-between items-center">

                      <h3 className="font-bold text-blue-600">

                        {item.type}

                      </h3>

                      <span className="text-sm text-gray-500">

                        {
                          new Date(
                            item.createdAt
                          ).toLocaleString()
                        }

                      </span>

                    </div>

                    <p className="text-gray-700 mt-3">

                      {item.message}

                    </p>

                  </div>

                )

              )

              :

              <div className="text-gray-400 text-center py-10">

                No interactions yet

              </div>
            }

          </div>

        </div>

      </div>

    </div>

  );

}

export default CustomerDetails;