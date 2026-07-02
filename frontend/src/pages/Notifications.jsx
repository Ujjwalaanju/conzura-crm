import Sidebar from "../components/Sidebar";

import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import io from
  "socket.io-client";

  import {

  toast,

} from
  "react-toastify";

  const socket =
  io(
    "http://localhost:5000"
  );

function Notifications() {

  const [notifications,
    setNotifications] =
    useState([]);

    const [formData,
  setFormData] =
  useState({

    title: "",

    message: "",

    type: "General",

    priority: "Medium",

    phone: "",

    email: "",

  });

  const [filter,
    setFilter] =
    useState("All");

  // FETCH NOTIFICATIONS
  const fetchNotifications =
    async () => {

      try {

        const res =
          await API.get(
            "/notifications"
          );

        setNotifications(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  // LOAD
  useEffect(() => {

  const loadNotifications =
    async () => {

      try {

        await fetchNotifications();

      } catch (error) {

        console.log(error);

      }

    };

  loadNotifications();


  // SOCKET LISTENER
  socket.on(

  "newNotification",

  (data) => {

    setNotifications(

      (prev) => [

        data,

        ...prev,

      ]

    );

    // POPUP ALERT
    toast.info(

      `${data.title}: ${data.message}`,

      {

        position:
          "top-right",

        autoClose:
          5000,

      }

    );

  }

);


  // CLEANUP
  return () => {

    socket.off(
      "newNotification"
    );

  };

}, []);

  // MARK READ
  const markAsRead =
    async (id) => {

      try {

        await API.put(

          `/notifications/${id}`

        );

        await fetchNotifications();

      } catch (error) {

        console.log(error);

      }

    };
    // CREATE NOTIFICATION
const createNotification =
  async (e) => {

    e.preventDefault();

    try {

      if (
  !formData.phone.startsWith("+")
) {

  return alert(

    "Enter phone number with country code"

  );

}

      const res =
        await API.post(

          "/notifications",

          formData

        );

      setNotifications([

        res.data,

        ...notifications,

      ]);

      setFormData({

        title: "",

        message: "",

        type: "General",

        priority: "Medium",

        phone: "",

        email: "",

      });

    } catch (error) {

      console.log(error);

    }

};

  // DELETE
  const deleteNotification =
    async (id) => {

      try {

        await API.delete(

          `/notifications/${id}`

        );

        await fetchNotifications();

      } catch (error) {

        console.log(error);

      }

    };

  // FILTERED
  const filteredNotifications =

    filter === "All"

      ?

      notifications

      :

      notifications.filter(

          (n) =>

            filter === "Unread"

              ?

              !n.read

              :

              n.read

        );

  // COUNTS
  const unreadCount =

    notifications.filter(
      (n) => !n.read
    ).length;

  const readCount =

    notifications.filter(
      (n) => n.read
    ).length;

  return (

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-950 min-h-screen">

        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div>

            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">

              Notifications

            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">

              CRM activity and workflow alerts

            </p>

          </div>

          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="border p-3 rounded-xl bg-white dark:bg-gray-900 dark:text-white"
          >

            <option>
              All
            </option>

            <option>
              Unread
            </option>

            <option>
              Read
            </option>

          </select>

        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Total Notifications

            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">

              {notifications.length}

            </h2>

          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Unread Alerts

            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">

              {unreadCount}

            </h2>

          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Read Notifications

            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">

              {readCount}

            </h2>

          </div>

        </div>
{/* CREATE NOTIFICATION */}

<form

  onSubmit={
    createNotification
  }

  className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-8"

>

  <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white">

    Create Notification

  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input

      type="text"

      placeholder="Title"

      value={formData.title}

      onChange={(e) =>
        setFormData({

          ...formData,

          title:
            e.target.value,

        })
      }

      className="p-3 rounded-xl border"

      required

    />
    <input

  type="text"

  placeholder="Customer Phone"

  value={formData.phone}

  onChange={(e) =>
    setFormData({

      ...formData,

      phone:
        e.target.value,

    })
  }

  className="p-3 rounded-xl border"

/>

<input

  type="email"

  placeholder="Customer Email"

  value={formData.email}

  onChange={(e) =>
    setFormData({

      ...formData,

      email:
        e.target.value,

    })
  }

  className="p-3 rounded-xl border"

/>

    <select

      value={formData.priority}

      onChange={(e) =>
        setFormData({

          ...formData,

          priority:
            e.target.value,

        })
      }

      className="p-3 rounded-xl border"

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

  </div>

  <textarea

    placeholder="Message"

    value={formData.message}

    onChange={(e) =>
      setFormData({

        ...formData,

        message:
          e.target.value,

      })
    }

    className="w-full mt-4 p-3 rounded-xl border"

    rows="4"

    required

  />

  <button

    type="submit"

    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"

  >

    Create Notification

  </button>

</form>
        {/* NOTIFICATIONS */}
        <div className="space-y-5">

          {

            filteredNotifications.length === 0 && (

              <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow text-center text-gray-500">

                No Notifications Found

              </div>

            )

          }

          {
            filteredNotifications.map(
              (notification) => (

                <div

                  key={
                    notification._id
                  }

                  className={`p-5 rounded-2xl shadow bg-white dark:bg-gray-900 border-l-4 transition-all ${
                    notification.read

                      ? "border-gray-300"

                      : "border-blue-600"
                  }`}
                >

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>

                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">

                        {

                          notification.title ||

                          "CRM Notification"

                        }

                      </h2>

                      <p className="text-gray-600 dark:text-gray-300 mt-1">

                        {
                          notification.message
                        }

                      </p>

                      <p className="text-sm text-gray-500 mt-1">

                        📞 {notification.phone}

                      </p>

                        <p className="text-sm text-gray-500">

                        📧 {notification.email}

                      </p>

                      <p className="text-sm text-gray-500 mt-2">

                        {
                          new Date(
                            notification.createdAt
                          ).toLocaleString()
                        }

                      </p>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">

                      {
                        !notification.read && (

                          <button

                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }

                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                          >

                            Mark Read

                          </button>

                        )
                      }

                      <button

                        onClick={() =>
                          deleteNotification(
                            notification._id
                          )
                        }

                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </div>

  );

}

export default Notifications;