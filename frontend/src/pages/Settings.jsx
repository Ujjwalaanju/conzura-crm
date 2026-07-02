import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

function Settings() {

  const [activeTab, setActiveTab] =
    useState("branding");

  const [settings, setSettings] =
    useState({

      crmName:
        "CONZURA CRM",

      defaultLeadStatus:
        "New",

    });

  useEffect(() => {

    const loadSettings =
      async () => {

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

          setSettings((prev) => ({
            ...prev,
            ...res.data,
          }));

        } catch (error) {

          console.log(error);

        }

      };

    loadSettings();

  }, []);

  const saveSettings =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(

          "http://localhost:5000/api/settings",

          settings,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );

        toast.success(
          "Settings Saved"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed To Save"
        );

      }

    };

  return (

    <div className="flex bg-gray-100 dark:bg-gray-950 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4 md:p-8">

        <h1 className="text-4xl font-black mb-8 dark:text-white">

          Settings

        </h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT MENU */}
          <div className="w-full lg:w-72">

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-4">

              <button

                onClick={() =>
                  setActiveTab(
                    "branding"
                  )
                }

                className={`w-full text-left p-4 rounded-2xl mb-2 ${
                  activeTab ===
                  "branding"

                    ? "bg-blue-600 text-white"

                    : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                }`}

              >

                Branding

              </button>

              <button

                onClick={() =>
                  setActiveTab(
                    "crm"
                  )
                }

                className={`w-full text-left p-4 rounded-2xl ${
                  activeTab ===
                  "crm"

                    ? "bg-blue-600 text-white"

                    : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                }`}

              >

                CRM Preferences

              </button>

            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-8">

            {/* BRANDING */}
            {activeTab ===
              "branding" && (

              <>

                <h2 className="text-2xl font-bold mb-6 dark:text-white">

                  Branding

                </h2>

                <label className="block mb-2 font-semibold dark:text-white">

                  CRM Name

                </label>

                <input

                  type="text"

                  value={
                    settings.crmName ||
                    ""
                  }

                  onChange={(e) =>
                    setSettings({

                      ...settings,

                      crmName:
                        e.target.value,

                    })
                  }

                  className="w-full border p-3 rounded-xl"

                />

              </>

            )}

            {/* CRM */}
            {activeTab ===
              "crm" && (

              <>

                <h2 className="text-2xl font-bold mb-6 dark:text-white">

                  CRM Preferences

                </h2>

                <label className="block mb-2 font-semibold dark:text-white">

                  Default Lead Status

                </label>

                <select

                  value={
                    settings.defaultLeadStatus ||
                    "New"
                  }

                  onChange={(e) =>
                    setSettings({

                      ...settings,

                      defaultLeadStatus:
                        e.target.value,

                    })
                  }

                  className="w-full border p-3 rounded-xl"

                >

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

                </select>

              </>

            )}

            <button

              onClick={saveSettings}

              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"

            >
              Save Settings

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Settings;