import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Pipeline from "./pages/Pipeline";

import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import PrivateRoute from "./components/PrivateRoute";
import Tickets from "./pages/Tickets";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import RoleRoute from "./components/RoleRoute";
import { Toaster } from "react-hot-toast";
import View from "./pages/View";
import LeadDetails from "./pages/LeadDetails";
import Payments from "./pages/Payments";
import Projects from "./pages/Projects";

function App() {
  return (
    <>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* LEADS */}
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager", "Team Leader", "Team Member"]}>
                <Leads />
              </RoleRoute>
            </PrivateRoute>
          }
        />

      

        {/* PIPELINE */}
        <Route
          path="/pipeline"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager"]}>
                <Pipeline />
              </RoleRoute>
            </PrivateRoute>
          }
        />



        {/* TASKS */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager", "Team Leader", "Team Member"]}>
                <Tasks />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager", "Team Leader", "Team Member"]}>
                <Notifications />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager"]}>
                <Reports />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* TICKETS */}
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager"]}>
                <Tickets />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager", "Team Leader"]}>
                <Users />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* ✅ NEW ROUTES */}
        <Route path="/view/:id" element={<View />} />
        <Route path="/lead-details/:id" element={<LeadDetails />} />
        <Route path="/payments/:id" element={<PrivateRoute><Payments /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><Projects /></PrivateRoute>} />

        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />

        <Route path="/projects/:id" element={<PrivateRoute><Projects /></PrivateRoute>} />

        <Route path="/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />

        <Route path="/payments/:id" element={<PrivateRoute><Payments /></PrivateRoute>} />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["Admin", "Team Manager", "Team Leader", "Team Member"]}>
                <Settings />
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>

      {/* TOASTER */}
      <Toaster position="top-right" />
    </>
  );
}

export default App;
