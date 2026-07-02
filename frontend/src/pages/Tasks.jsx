import Sidebar from "../components/Sidebar";

import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import Calendar
from "react-calendar";

import "react-calendar/dist/Calendar.css";

function Tasks() {

  const [selectedDate,
    setSelectedDate] =
    useState(new Date());

  const [tasks, setTasks] =
    useState([]);

  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      activityType: "Task",

      priority: "Medium",

      status: "Pending",

      assignedTo: "",

      customer: "",

      meetingLocation: "",

      followUpNotes: "",

      reminderDate: "",

      dueDate: "",

    });

  // ANALYTICS
  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status !==
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

  // FETCH TASKS
  useEffect(() => {

    const fetchTasks =
      async () => {

        try {

          const res =
            await API.get(
              "/tasks"
            );

          setTasks(
            res.data
          );

        } catch (err) {

          console.log(err);

        }

      };

    fetchTasks();

  }, []);

  // HANDLE INPUT
  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,

      });

    };

  // ADD TASK
  const addTask =
    async () => {

      try {

        const res =
          await API.post(

            "/tasks",

            formData

          );

        setTasks([
          ...tasks,
          res.data,
        ]);

        setFormData({

          title: "",

          description: "",

          activityType: "Task",

          priority: "Medium",

          status: "Pending",

          assignedTo: "",

          customer: "",

          meetingLocation: "",

          followUpNotes: "",

          reminderDate: "",

          dueDate: "",

        });

      } catch (err) {

        console.log(err);

      }

    };

  // DELETE TASK
  const deleteTask =
    async (id) => {

      try {

        await API.delete(
          `/tasks/${id}`
        );

        setTasks(

          tasks.filter(
            (task) =>
              task._id !== id
          )

        );

      } catch (err) {

        console.log(err);

      }

    };

  // UPDATE STATUS
  const toggleStatus =
    async (task) => {

      try {

        let newStatus =
          "Pending";

        if (
          task.status ===
          "Pending"
        ) {

          newStatus =
            "In Progress";

        }

        else if (
          task.status ===
          "In Progress"
        ) {

          newStatus =
            "Completed";

        }

        const res =
          await API.put(

            `/tasks/${task._id}`,

            {
              status:
                newStatus,
            }

          );

        setTasks(

          tasks.map((t) =>

            t._id ===
            task._id

              ? res.data

              : t

          )

        );

      } catch (err) {

        console.log(err);

      }

    };

  // PRIORITY COLORS
  const getPriorityColor =
    (priority) => {

      switch (priority) {

        case "Urgent":
          return "bg-red-200 text-red-700";

        case "High":
          return "bg-orange-100 text-orange-600";

        case "Medium":
          return "bg-yellow-100 text-yellow-600";

        case "Low":
          return "bg-green-100 text-green-600";

        default:
          return "bg-gray-100 text-gray-600";

      }

    };

  // OVERDUE
  const isOverdue =
    (task) => {

      if (
        !task.dueDate ||
        task.status ===
          "Completed"
      ) {

        return false;

      }

      return (

        new Date(
          task.dueDate
        )

        <

        new Date()

      );

    };

  // REMINDER
  const isReminderToday =
    (task) => {

      if (
        !task.reminderDate
      ) {

        return false;

      }

      const today =
        new Date();

      const reminder =
        new Date(
          task.reminderDate
        );

      return (

        today.toDateString()

        ===

        reminder.toDateString()

      );

    };

  return (

    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-800">

            Task & Activity Management

          </h1>

        </div>

        {/* KPI DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {/* TOTAL */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Total Tasks

            </p>

            <h2 className="text-3xl font-bold mt-2">

              {tasks.length}

            </h2>

          </div>

          {/* COMPLETED */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Completed

            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">

              {completedTasks}

            </h2>

          </div>

          {/* PENDING */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Pending

            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">

              {pendingTasks}

            </h2>

          </div>

          {/* PRODUCTIVITY */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">

              Productivity

            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">

              {productivityRate}%

            </h2>

          </div>

        </div>

        {/* CALENDAR */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            Activity Calendar

          </h2>

          <Calendar

            onChange={
              setSelectedDate
            }

            value={
              selectedDate
            }

          />

        </div>

        {/* ADD TASK */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            Add Activity

          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* TITLE */}
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

            {/* DESCRIPTION */}
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

            {/* TYPE */}
            <select
              name="activityType"
              value={
                formData.activityType
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            >

              <option>Task</option>
              <option>Meeting</option>
              <option>Call</option>
              <option>Follow-Up</option>

            </select>

            {/* PRIORITY */}
            <select
              name="priority"
              value={
                formData.priority
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            >

              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>

            </select>

            {/* STATUS */}
            <select
              name="status"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            >

              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>

            </select>

            {/* ASSIGNED */}
            <input
              type="text"
              name="assignedTo"
              placeholder="Assigned User"
              value={
                formData.assignedTo
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

            {/* CUSTOMER */}
            <input
              type="text"
              name="customer"
              placeholder="Customer"
              value={
                formData.customer
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

            {/* LOCATION */}
            <input
              type="text"
              name="meetingLocation"
              placeholder="Meeting Location"
              value={
                formData.meetingLocation
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

            {/* FOLLOW UP */}
            <input
              type="text"
              name="followUpNotes"
              placeholder="Follow-Up Notes"
              value={
                formData.followUpNotes
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

            {/* REMINDER */}
            <input
              type="datetime-local"
              name="reminderDate"
              value={
                formData.reminderDate
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

            {/* DUE */}
            <input
              type="date"
              name="dueDate"
              value={
                formData.dueDate
              }
              onChange={
                handleChange
              }
              className="p-3 rounded-xl border"
            />

          </div>

          <button
            onClick={addTask}
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >

            Add Activity

          </button>

        </div>

        {/* OVERDUE */}
        {
          tasks.some((task) =>
            isOverdue(task)
          ) && (

            <div className="bg-red-100 border border-red-300 p-5 rounded-2xl mb-8">

              <h2 className="text-xl font-bold text-red-700 mb-4">

                Overdue Activities

              </h2>

              <div className="space-y-3">

                {
                  tasks

                  .filter((task) =>
                    isOverdue(task)
                  )

                  .map((task) => (

                    <div
                      key={task._id}
                      className="bg-white p-4 rounded-xl"
                    >

                      <p className="font-semibold text-gray-800">

                        {task.title}

                      </p>

                      <p className="text-sm text-gray-500 mt-1">

                        Due:
                        {" "}

                        {
                          new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        }

                      </p>

                    </div>

                  ))
                }

              </div>

            </div>

          )
        }

        {/* TASK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {
            tasks.map((task) => (

              <div
                key={task._id}
                className="bg-white p-6 rounded-2xl shadow"
              >

                <h2 className="text-2xl font-bold text-gray-800">

                  {task.title}

                </h2>

                <p className="text-gray-500 mt-3">

                  {task.description}

                </p>

                <p className="text-sm text-blue-600 font-semibold mt-3">

                  {task.activityType}

                </p>

                <p className="text-sm text-gray-500 mt-2">

                  Assigned:
                  {" "}
                  {
                    task.assignedTo ||
                    "N/A"
                  }

                </p>

                <p className="text-sm text-gray-500 mt-2">

                  Customer:
                  {" "}
                  {
                    task.customer ||
                    "N/A"
                  }

                </p>

                <p className="text-sm text-gray-500 mt-2">

                  Location:
                  {" "}
                  {
                    task.meetingLocation ||
                    "N/A"
                  }

                </p>

                <p className="text-sm text-gray-500 mt-2">

                  Follow-Up:
                  {" "}
                  {
                    task.followUpNotes ||
                    "N/A"
                  }

                </p>

                <p className="text-sm text-red-500 mt-2">

                  Reminder:
                  {" "}

                  {
                    task.reminderDate

                      ?

                      new Date(
                        task.reminderDate
                      ).toLocaleString()

                      :

                      "N/A"
                  }

                </p>

                {/* PRIORITY */}
                <div className="mt-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}
                  >

                    {task.priority}

                  </span>

                </div>

                {/* STATUS */}
                <div className="mt-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === "Completed"

                        ? "bg-green-100 text-green-600"

                        : task.status ===
                          "In Progress"

                        ? "bg-blue-100 text-blue-600"

                        : task.status ===
                          "Cancelled"

                        ? "bg-gray-200 text-gray-700"

                        : "bg-red-100 text-red-600"
                    }`}
                  >

                    {task.status}

                  </span>

                </div>

                {/* OVERDUE */}
                {
                  isOverdue(task) && (

                    <div className="mt-3 bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold">

                      Overdue Task

                    </div>

                  )
                }

                {/* REMINDER */}
                {
                  isReminderToday(task) && (

                    <div className="mt-3 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm font-semibold">

                      Reminder Today

                    </div>

                  )
                }

                {/* DUE */}
                <p className="text-sm text-gray-500 mt-4">

                  Due:
                  {" "}

                  {
                    task.dueDate

                      ?

                      new Date(
                        task.dueDate
                      ).toLocaleDateString()

                      :

                      "No Date"
                  }

                </p>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() =>
                      toggleStatus(task)
                    }
                    className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-xl"
                  >

                    Update

                  </button>

                  <button
                    onClick={() =>
                      deleteTask(task._id)
                    }
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-xl"
                  >

                    Delete

                  </button>

                </div>

              </div>

            ))
          }

        </div>

        {/* TIMELINE */}
        <div className="bg-white rounded-2xl shadow p-6 mt-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-8">

            Activity Timeline

          </h2>

          <div className="space-y-5">

            {
              tasks.map((task) => (

                <div
                  key={task._id}
                  className="border-l-4 border-blue-500 pl-5 py-2"
                >

                  <h3 className="font-bold text-gray-800">

                    {task.title}

                  </h3>

                  <p className="text-gray-500 mt-1">

                    {task.activityType}
                    {" "}
                    •
                    {" "}
                    {task.status}

                  </p>

                  <p className="text-sm text-gray-400 mt-1">

                    {
                      new Date(
                        task.createdAt
                      ).toLocaleString()
                    }

                  </p>

                </div>

              ))
            }

          </div>

        </div>

      </div>

    </div>

  );

}

export default Tasks;