
import axios from "axios";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import logo from "../assets/conzura-logo.png";

function Login() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] =
    useState(true);

  const [name, setName] =
    useState("");
  const [role, setRole] = useState("Team Manager");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  // FORGOT PASSWORD
  const [forgotEmail,
    setForgotEmail] =
    useState("");

  const [showForgot,
    setShowForgot] =
    useState(false);

    const [crmName, setCrmName] =
  useState("CONZURA CRM");

  useEffect(() => {

  const loadSettings =
    async () => {

      try {

        const res =
          await axios.get(
            "http://localhost:5000/api/settings"
          );

        console.log("API Response:", res.data);

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


  // LOGIN
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(

        "http://localhost:5000/api/auth/login",

        {
          email,
          password,
        }

      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      toast.success(
        "Login Success"
      );

      navigate("/dashboard");

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Login Failed"

      );

    }

  };



  // REGISTER
  const handleRegister =
    async (e) => {

      e.preventDefault();

      if (
        password !== confirmPassword
      ) {

        toast.error(
          "Passwords do not match"
        );

        return;

      }

      try {

        const res =
          await axios.post(

            "http://localhost:5000/api/auth/register",

            {
              name,
              email,
              password,
              role,
            }

          );

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(res.data)
        );

        toast.success(
          "Account Created Successfully"
        );

        navigate("/dashboard");

      } catch (error) {

        toast.error(

          error.response?.data?.message ||

          "Registration Failed"

        );

      }

    };



  // FORGOT PASSWORD
  const handleForgotPassword =
    async () => {

      try {

        const res = await axios.post(

          "http://localhost:5000/api/auth/forgot-password",

          {
            email: forgotEmail,
          }

        );

        toast.success(
          "Reset token generated"
        );

        console.log(
          res.data.resetToken
        );

      } catch (error) {

        toast.error(

          error.response?.data?.message ||

          "Something went wrong"

        );

      }

    };



  return (

    <div className="h-screen flex bg-white overflow-hidden">

      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-200 p-14 flex-col justify-between relative overflow-hidden">

        {/* BRAND */}
        <div>

          <div className="flex items-center gap-4 mb-14">

            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">

              <img
  src={logo}
  alt="Conzura"
  className="w-12 h-12 object-contain"
/>

            </div>

            <div>

              <h1 className="text-4xl font-black text-gray-900 tracking-wide">
                {crmName}
              </h1>

              <p className="text-gray-600 text-sm mt-1">
                AI Powered Sales Management
              </p>

            </div>

          </div>



          {/* HEADING */}
          <h1 className="text-5xl font-black leading-tight text-gray-900 max-w-xl">

            Manage your sales smarter with

            <span className="text-blue-600">
              {" "}one powerful CRM.
            </span>

          </h1>



          {/* DESC */}
          <p className="text-gray-700 mt-8 text-lg leading-8 max-w-lg">

            Track leads, manage customers,
            monitor deals, and grow your
            business from one intelligent dashboard.

          </p>

        </div>



        {/* STATS */}
        <div className="flex gap-12">

          <div>

            <h2 className="text-4xl font-black text-blue-700">
              98%
            </h2>

            <p className="text-gray-700 mt-2">
              Retention
            </p>

          </div>

          <div>

            <h2 className="text-4xl font-black text-blue-700">
              2.5x
            </h2>

            <p className="text-gray-700 mt-2">
              Faster Sales
            </p>

          </div>

          <div>

            <h2 className="text-4xl font-black text-blue-700">
              40%
            </h2>

            <p className="text-gray-700 mt-2">
              Revenue Growth
            </p>

          </div>

        </div>

        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300 opacity-20 rounded-full"></div>

      </div>



      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-6 bg-white">

        <form

          onSubmit={
            isLogin
              ? handleLogin
              : handleRegister
          }

          className="w-full max-w-md"

        >

          {/* TITLE */}
          <h1 className="text-4xl font-black text-gray-900 mb-3">

            {
              isLogin
                ? "Welcome Back"
                : "Create Account"
            }

          </h1>



          {/* SUBTITLE */}
          <p className="text-gray-500 mb-6 text-base">

            {
              isLogin

                ? "Login to continue to your dashboard."

                : "Create your CRM account to get started."
            }

          </p>



          {/* NAME */}
          {
            !isLogin && (

              <div className="mb-4">

                <label className="block mb-2 font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-xl p-3"
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

            )
          }



          {/* EMAIL */}
          <div className="mb-4">

            <label className="block mb-2 font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-xl p-3"
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          {/* ROLE */}
          {!isLogin && (
            <select
              className="w-full border border-gray-300 rounded-xl p-3 mb-4"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Team Manager">Team Manager</option>
              <option value="Team Leader">Team Leader</option>
              <option value="Team Member">Team Member</option>
            </select>
          )}


          {/* PASSWORD */}
          <div className="mb-4">

            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-xl p-3"
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>



          {/* CONFIRM */}
          {
            !isLogin && (

              <div className="mb-4">

                <label className="block mb-2 font-semibold text-gray-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full border border-gray-300 rounded-xl p-3"
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

              </div>

            )
          }



          {/* LOGIN OPTIONS */}
          {
            isLogin && (

              <div className="flex justify-between items-center mb-6">

                <div className="flex items-center gap-2">

                  <input type="checkbox" />

                  <p className="text-gray-600 text-sm">
                    Remember me
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowForgot(!showForgot)
                  }
                  className="text-blue-600 hover:underline text-sm"
                >
                  Forgot password?
                </button>

              </div>

            )
          }



          {/* FORGOT PASSWORD */}
          {
            showForgot && (

              <div className="mb-6 bg-blue-50 p-4 rounded-2xl">

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-xl p-3 mb-4"
                  onChange={(e) =>
                    setForgotEmail(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl"
                >
                  Generate Reset Token
                </button>

              </div>

            )
          }



          {/* BUTTON */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-xl text-lg font-semibold shadow-lg"
          >

            {
              isLogin
                ? "Sign In →"
                : "Create Account →"
            }

          </button>



          {/* TOGGLE REMOVED */}

        </form>

      </div>

    </div>

  );

}

export default Login;