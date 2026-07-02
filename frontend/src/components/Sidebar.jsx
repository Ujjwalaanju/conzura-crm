import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  Settings,
  LogOut,
  CheckSquare,
  BarChart3,
  Moon,
  Sun,
  Bell,
  FolderKanban,
  CreditCard
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { Menu, X } from "lucide-react";

import logo from "../assets/conzura-logo.png";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // Fix localStorage email for projects module
  if (user && user.email && !localStorage.getItem("email")) {
    localStorage.setItem("email", user.email);
  }

  const getLinkClass = (path) => {
    const isActive = path === "/dashboard" ? currentPath === "/dashboard" : currentPath.startsWith(path);
    return isActive
      ? "flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold transition border-l-4 border-blue-600 shadow-sm"
      : "flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition border-l-4 border-transparent";
  };

  // DARK MODE
  const [darkMode,
    setDarkMode] =
    useState(

      localStorage.getItem(
        "theme"
      ) === "dark"

    );

  // NOTIFICATIONS
  const [unreadCount,
    setUnreadCount] =
    useState(0);

    const [crmName, setCrmName] =
  useState("CONZURA CRM");

  const [sidebarOpen, setSidebarOpen] =
  useState(false);

  // APPLY THEME
  useEffect(() => {

    if (darkMode) {

      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }, [darkMode]);

  // FETCH NOTIFICATIONS
  useEffect(() => {

    const loadNotifications =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await fetch(

              "http://localhost:5000/api/notifications",

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }

            );

          const data =
            await res.json();

          const unread =
            data.filter(

              (n) => !n.read

            ).length;

          setUnreadCount(
            unread
          );

        } catch (error) {

          console.log(error);

        }

      };

    loadNotifications();

  }, []);

  useEffect(() => {

  const loadSettings = async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await axios.get(

          "http://localhost:5000/api/settings",

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

      setCrmName(
        res.data.crmName ||
        "CONZURA CRM"
      );

    } catch (error) {

      console.log(error);

    }

  };

  loadSettings();

}, []);

  return (
  <>
  <button
  onClick={() =>
    setSidebarOpen(!sidebarOpen)
  }
  className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-xl"
>
  {
    sidebarOpen
      ? <X size={22} />
      : <Menu size={22} />
  }
</button>
    <div
  className={`
    fixed md:relative
    top-0 left-0
    h-screen
    w-72
    bg-white dark:bg-gray-900
    border-r border-gray-200 dark:border-gray-800
    shadow-sm
    flex flex-col justify-between
    transition-all duration-300
    z-40
    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full md:translate-x-0"
    }
  `}
>

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">

          <div className="flex items-center gap-4">

            <img
  src={logo}
  alt="Conzura"
  className="w-12 h-12 object-contain"
/>

            <div>

              <h1 className="text-2xl font-black text-gray-900 dark:text-white">

                {crmName}

              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">

                Enterprise CRM

              </p>

            </div>

          </div>

        </div>

        {/* USER */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">

          <h2 className="font-bold text-gray-800 dark:text-white">

            {user?.name || "User"}

          </h2>

          <p className="text-sm text-blue-600 mt-1">

            {user?.role || "Employee"}

          </p>

        </div>

        {/* MENU */}
        {/* MENU */}
<div className="p-4 space-y-2">

  {/* DASHBOARD - ALL */}
  <Link
    to="/dashboard"
    className={getLinkClass("/dashboard")}
  >
    <LayoutDashboard size={22} />
    <span className="font-medium">
      Dashboard
    </span>
  </Link>

 {/* LEADS */}
{(user?.role === "Admin" || user?.role === "Team Manager" || user?.role === "Team Leader" || user?.role === "Team Member") && (
  <Link to="/leads" className={getLinkClass("/leads")}>
    <UserPlus size={22} />
    <span className="font-medium">Leads</span>
  </Link>
)}

{(user?.role === "Admin" ||
  user?.role === "Team Manager" ||
  user?.role === "Team Leader" ||
  user?.role === "Team Member") && (
  <Link
    to="/projects"
    className={getLinkClass("/projects")}
  >
    <FolderKanban size={22} />
    <span className="font-medium">
      Projects
    </span>
  </Link>
)}

{(user?.role === "Admin" ||
  user?.role === "Team Manager" ||
  user?.role === "Team Leader" ||
  user?.role === "Team Member") && (
  <Link
    to="/payments"
    className={getLinkClass("/payments")}
  >
    <CreditCard size={22} />
    <span className="font-medium">
      Payments
    </span>
  </Link>
)}

{/* PIPELINE - Only Admin or Team Manager */}
{(user?.role === "Admin" || user?.role === "Team Manager") && (
  <Link to="/pipeline" className={getLinkClass("/pipeline")}>
    <Briefcase size={22} />
    <span className="font-medium">Pipeline</span>
  </Link>
)}

{/* TASKS - Admin + Manager + Leader + Member */}
{(user?.role === "Admin" || user?.role === "Team Manager" || user?.role === "Team Leader" || user?.role === "Team Member") && (
  <Link to="/tasks" className={getLinkClass("/tasks")}>
    <CheckSquare size={22} />
    <span className="font-medium">Tasks</span>
  </Link>
)}

{/* NOTIFICATIONS - ALL */}
<Link to="/notifications" className={getLinkClass("/notifications")}>
  <div className="flex items-center gap-4">
    <Bell size={22} />
    <span className="font-medium">Notifications</span>
  </div>
  {unreadCount > 0 && (
    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
  )}
</Link>

{/* REPORTS - Only Admin or Team Manager */}
{(user?.role === "Admin" || user?.role === "Team Manager") && (
  <Link to="/reports" className={getLinkClass("/reports")}>
    <BarChart3 size={22} />
    <span className="font-medium">Reports</span>
  </Link>
)}

{/* USERS - Admin, Team Manager, and Team Leader */}
{(user?.role === "Admin" || user?.role === "Team Manager" || user?.role === "Team Leader") && (
  <Link to="/users" className={getLinkClass("/users")}>
    <Users size={22} />
    <span className="font-medium">Users</span>
  </Link>
)}

{/* SETTINGS - All roles */}
{(user?.role === "Admin" || user?.role === "Team Manager" || user?.role === "Team Leader" || user?.role === "Team Member") && (
  <Link to="/settings" className={getLinkClass("/settings")}>
    <Settings size={22} />
    <span className="font-medium">Settings</span>
  </Link>
)}

</div>

      </div>

      {/* BOTTOM */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">

        {/* DARK MODE */}
        <button
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition mb-3"
        >

          {

            darkMode

              ?

              <Sun size={22} />

              :

              <Moon size={22} />

          }

          <span className="font-medium">

            {

              darkMode

                ?

                "Light Mode"

                :

                "Dark Mode"

            }

          </span>

        </button>

        {/* LOGOUT */}
        <button
          onClick={() => {

            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "user"
            );

            window.location.href =
              "/";

          }}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >

          <LogOut size={22} />

          <span className="font-medium">

            Logout

          </span>

        </button>

            </div>

    </div>

  </>

  );

}

export default Sidebar;