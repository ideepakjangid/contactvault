import React, { useState } from "react";
import Container from "../components/Container";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { axiosInstance } from "../../library/helper";
import toast from "react-hot-toast";
import ImageUploader from "../components/ImageUploader";
import { useSelector } from "react-redux";

const AddConatct = () => {
  const [contact, setConatct] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const contactHandler = (e) => {
    if (isNaN(e.target.value.trim()) == false) {
      setConatct(e.target.value.trim());
    }
  };

  const validate = (e) => {
    const newError = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (e.target.name.value.trim() == "") {
      newError.name = "Name is required!";
    }
    if (e.target.email.value.trim() == "") {
      newError.email = "Email is required!";
    }
    if (e.target.email.value.trim() != "") {
      if (!emailPattern.test(e.target.email.value.trim())) {
        newError.email = "Please enter a valid email!";
      }
    }
    if (contact == "") {
      newError.contact = "Contact is required!";
    }

    setError(newError);
    return newError;
  };

  const contactSumbitHandler = async (e) => {
    e.preventDefault();
    const errorResult = validate(e);
    if (Object.values(errorResult).every((v) => !v)) {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", e.target.name.value.trim());
      formData.append("email", e.target.email.value.trim());
      formData.append("contact", contact);
      formData.append("user", user?.data?._id);
      formData.append("profile_image", imageFile);
      console.log(user?.token)
      const response = await axiosInstance.post(
        `${process.env.API_URL}/api/contact/create`, // Ensure API_URL is correctly set
        formData,
        {
          headers:{
            Authorization:user?.token
          }
        }
      );

      console.log(response);
      if (response.data.flag == 1) {
        toast.success("Contact added successfully");
        e.target.reset();
        navigate("/");
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    }
  };

  return (
    <Container className={"p-5"}>
      <div className="flex justify-between items-center ">
        <h3 className="text-2xl font-bold text-gray-600">Add Contact</h3>
        <Link
          to={"/"}
          className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <IoReturnUpBackOutline className="text-xl font-bold" /> Back
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:flex gap-3 mt-5 ">
        <ImageUploader setImageFiles={setImageFile} />
        <form
          onSubmit={contactSumbitHandler}
          className="flex-1 flex flex-col gap-3 "
        >
          <div className="flex flex-col">
            <input
              className="p-2 border rounded focus:outline-none"
              type="text"
              name="name"
              placeholder="Enter Name"
            />
            {error.name && (
              <p className="text-red-600 text-[14px]">{error.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <input
              className="p-2 border rounded  focus:outline-none"
              type="text"
              name="email"
              placeholder="Enter Email"
            />
            {error.email && (
              <p className="text-red-600 text-[14px]">{error.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="border rounded flex items-center px-2">
              <span>+91</span>
              <input
                className="flex-1 p-2 rounded focus:outline-none"
                type="text"
                maxLength={10}
                value={contact}
                onChange={contactHandler}
                placeholder="Enter Contact"
              />
            </div>
            {error.contact && (
              <p className="text-red-600 text-[14px]">{error.contact}</p>
            )}
          </div>
          <button
            type="submit"
            className=" text-[18px] flex gap-2 items-center justify-center focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2.5  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <PulseLoader loading={loading} size={8} color="#ffffff" /> Add
          </button>
        </form>
      </div>
    </Container>
  );
};

export default AddConatct;
