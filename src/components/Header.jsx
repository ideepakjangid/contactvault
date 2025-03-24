import React, { useEffect, useState } from "react";
import Container from "./Container";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout, lsToAdmin } from "../redux/Slices/User";
import { useNavigate } from "react-router-dom";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const Header = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    dispatcher(lsToAdmin());
  }, []);
  useEffect(() => {
    if (user?.data == null && localStorage.getItem("user") == null) {
      navigate("/login");
    }
  }, [user?.data]);

  return (
    <div className="w-full bg-blue-950 sticky top-0 z-50 ">
      <Container
        className={"p-4 flex justify-between items-center relative   "}
      >
        <h1 className="text-3xl text-white font-bold">ContactVault</h1>
        <div className="hidden sm:flex gap-3 items-center">
          <h2 className="text-white text-xl ">
            Hi, <span className="font-bold italic">{user?.data?.name}</span>
          </h2>
          <button
            onClick={() => dispatcher(logout())}
            type="button"
            className="flex gap-2 items-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            {" "}
            <IoIosLogOut className="text-xl" /> Logout
          </button>
        </div>
        <div className="sm:hidden text-white text-2xl hover:cursor-pointer">
          <FaBarsStaggered onClick={() => setIsSideBarOpen(true)} />
        </div>
        <div
          className={`sm:hidden z-[9999] fixed top-0 right-0 w-[75vw] min-h-screen bg-blue-950 transition-all duration-700 ${
            isSideBarOpen ? "right-0" : "right-[-75vw]"
          }`}
        >
          <RxCross2
            onClick={() => setIsSideBarOpen(false)}
            className="hover:cursor-pointer absolute top-5 right-5 text-white font-bold text-3xl"
          />
          <h2 className="text-white text-xl mt-5 ps-5 ">
            Hi, <span className="font-bold italic">{user?.data?.name}</span>
          </h2>
          <div
            onClick={() => dispatcher(logout())}
            className="absolute bottom-0 w-full flex gap-2 justify-center items-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            <IoIosLogOut className="text-xl" /> Logout
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
