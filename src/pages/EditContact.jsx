import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { axiosInstance } from "../../library/helper";
import toast from "react-hot-toast";
import { getContact } from "../../library/apiCalls";
import ImageUploader from "../components/ImageUploader";
import UserProfile from "../assets/UserProfile_1.jpg";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const EditContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState({});
  const [contactNo, setContactNo] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params.id;
  const user = useSelector(state=>state.user)
  const navigate = useNavigate();
  const contactHandler = (e) => {
    if (isNaN(e.target.value.trim()) == false) {
      setContactNo(e.target.value.trim());
    }
  };

  const changeHandler = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const contactSumbitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", e.target.name.value.trim());
    formData.append("email", e.target.email.value.trim());
    formData.append("contact", contactNo);
    const response = await axiosInstance.put(
      process.env.API_URL + `/api/contact/update-contact/${contact?._id}`,
      formData,
      {
        headers:{
          Authorization:user?.token
        }
      }
    );
    if (response.data.flag == 1) {
      toast.success(response.data.message);
      navigate("/");
      setLoading(false);
    } else {
      toast.error(response.data.message);
      setLoading(false);
    }
  };

  const fetchContact = async () => {
    const response = await getContact(user?.data?._id,id);
    setContact(response);
    setContactNo(response?.contact);
  };

  const profileImageDeleteHandler = async () => {
    if (!contact.profile_image) {
      return toast.error("No Profile Image!");
    }
    const response = await axiosInstance.patch(
      process.env.API_URL + `/api/contact/delete-profile-image/${contact._id}`,{},{headers:{
        Authorization:user?.token
      }}
    );
    if (response.data.flag == 1) {
      setContact({ ...contact, profile_image: null });
      toast.success("Profile Images removed!")
    } else {
      toast.error("Unable to delete Profile Image!");
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  return (
    <Container className={"p-5"}>
      <div className="flex justify-between items-center ">
        <h3 className="text-2xl font-bold text-gray-600">Edit Contact</h3>
        <Link
          to={"/"}
          class="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <IoReturnUpBackOutline className="text-xl font-bold" /> Back
        </Link>
      </div>
      <div className="grid grid-cols-1  sm:flex gap-3 mt-4">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden group relative">
          <div className="flex gap-2 justify-center text-3xl text-white  items-center w-full h-full mx-auto absolute bg-black/70 opacity-0 transition duration-500 group-hover:opacity-100 ">
            <FaRegEdit
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer hover:text-gray-500"
            />{" "}
            <MdDelete
              onClick={profileImageDeleteHandler}
              className="cursor-pointer hover:text-gray-500"
            />
          </div>
          <ImageUploadModal
            contact={contact}
            setContact={setContact}
            contact_id={contact?._id}
            isOpen={isOpen}
            onClose={() => setIsOpen(!isOpen)}
            user={user}
          />
          <img
            className="w-full h-full object-cover"
            src={
              contact?.profile_image
                ? process.env.API_URL +
                  `/profile-images/${contact.profile_image}`
                : UserProfile
            }
            alt="Profile"
          />
        </div>
        <form
          onSubmit={contactSumbitHandler}
          className="flex-1 flex flex-col gap-3"
        >
          <input
            className="p-2 border rounded focus:outline-none"
            type="text"
            name="name"
            onChange={changeHandler}
            value={contact?.name}
            placeholder="Enter Name"
          />
          <input
            className="p-2 border rounded  focus:outline-none"
            type="text"
            name="email"
            onChange={changeHandler}
            placeholder="Enter Email"
            value={contact?.email}
          />
          <div className="border rounded flex items-center px-2">
            <span>+91</span>
            <input
              className="flex-1 p-2 rounded focus:outline-none"
              type="text"
              maxLength={10}
              value={contactNo}
              onChange={contactHandler}
              placeholder="Enter Contact"
            />
          </div>
          <button
            type="submit"
            class=" text-[18px] flex gap-2 items-center justify-center focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2.5  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            <PulseLoader loading={loading} size={8} color="#ffffff" /> Update
          </button>
        </form>
      </div>
    </Container>
  );
};

export default EditContact;

function ImageUploadModal({
  isOpen,
  onClose,
  contact_id,
  setContact,
  contact,
  user
}) {
  const [imageFile, setImageFile] = useState(null);

  const uploadHandler = async () => {
    const formData = new FormData();
    formData.append("profile_image", imageFile);
    const response = await axiosInstance.patch(
      process.env.API_URL + `/api/contact/profile-upload/${contact_id}`,
      formData,
      {headers:{
        Authorization:user?.token
      }}
    );
    if (response.data.flag == 1) {
      setContact({ ...contact, profile_image: response.data.image_name });
      toast.success("Profile upload successfully!");
      onClose();
    } else {
      toast.error("Something went wrong!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">Upload Image</h2>
        <ImageUploader setImageFiles={setImageFile} />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="w-full px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={uploadHandler}
            disabled={!imageFile}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
