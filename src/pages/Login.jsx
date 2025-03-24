import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircleLoader from "react-spinners/CircleLoader";
import { axiosInstance } from "../../library/helper";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../redux/Slices/User";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({})
  const dispatcher = useDispatch()
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newError = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (user.email == "") {
      newError.email = "Please enter an email!";
    }
    if (user.email != "") {
      if (!emailPattern.test(user.email)) {
        newError.email = "Please enter a valid email!";
      }
    }
    if (user.password == "") {
      newError.password = "Please enter a password!";
    }
    setError(newError);
    return newError;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const errorResult = validate();
    if (Object.values(errorResult).every((v) => !v)) {
      setLoading(true);
      const response = await axiosInstance.post(
        process.env.API_URL + "/api/user/login",
        {
          email: user.email.toLowerCase(),
          password: user.password,
        }
      );
      console.log("response",response)
      if (response.data.flag == 1) {
        setLoading(false);
        dispatcher(login({user:response.data.user,token:response.data.token}))
        localStorage.setItem("user",JSON.stringify(response.data.user))
        localStorage.setItem("token",JSON.stringify(response.data.token))
        toast.success(response.data.message);
        navigate("/");
      } else {
        setLoading(false);
        toast.error(response.data.message);
      }
    }
  };
  return (
    <div className="mt-8 relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
      <div className="w-full">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
          <p className="mt-2 text-gray-500">
            Sign in below to access your account
          </p>
        </div>
        <div className="mt-5">
          <form onSubmit={submitHandler}>
            <div>
              <div className={`relative ${error.name ? "mt-1" : "mt-6"}`}>
                <input
                  type="email"
                  name="email"
                  onChange={changeHandler}
                  id="email"
                  placeholder="Email Address"
                  className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                  autoComplete="NA"
                />
                <label
                  htmlFor="email"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Email Address
                </label>
              </div>
              {error.email && (
                <p className="text-[14px] text-red-500">{error.email}</p>
              )}
            </div>
            <div>
              <div className={`relative ${error.email ? "mt-1" : "mt-6"}`}>
                <input
                  type="password"
                  name="password"
                  onChange={changeHandler}
                  id="password"
                  placeholder="Password"
                  className="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
                />
                <label
                  htmlFor="password"
                  className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800"
                >
                  Password
                </label>
              </div>
              {error.password && (
                <p className="text-[14px] text-red-500">{error.password}</p>
              )}
            </div>
            <div className="my-6">
              <button
                type="submit"
                className="flex gap-3 items-center justify-center w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
              >
                <CircleLoader loading={loading} size={20} color="#ffffff" />{" "}
               <span>Sign in</span>
              
              </button>
            </div>
            <p className="text-center text-sm text-gray-500">
              Don't have an account yet?
              <Link
                to={"/register"}
                className="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
              >Sign up
               </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
