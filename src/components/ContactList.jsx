import React, { useEffect, useState } from "react";
import Container from "./Container";
import { IoPersonAdd } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { getContacts } from "../../library/apiCalls";
import { axiosInstance } from "../../library/helper";
import toast from "react-hot-toast";
import UserProfile from "../assets/UserProfile_1.jpg";
import { useSelector } from "react-redux";

const ContactList =  () => {
    const [contacts, setContacts] = useState([])
    const user = useSelector(state=>state.user)
    const fetchContacts = async ()=>{
      if (!user?.data || !user.data._id) return;
        const response = await getContacts(user.data?._id);
        setContacts(response)
    }

    const changeHandler =async (e)=>{
        if(e.target.value.trim() != ''){
            const response = await getContacts(user?.data?._id,e.target.value.trim())
            setContacts(response)
        }else{
            const response = await getContacts(user?.data?._id);
            setContacts(response)
        }
    }

    const deleteHandler = async (id)=>{
      console.log(user?.token)
        const response = await axiosInstance.delete(process.env.API_URL+`/api/contact/delete-contact/${id}`,{headers:{Authorization:user?.token}});
        console.log(response)
        if(response.data.flag == 1){
            toast.success(response.data.message)
            window.location.reload();
        }else{
            toast.error(response.data.message)
        }
    }

    useEffect(
        ()=>{
            fetchContacts();
        },[]
    )

  return (
    <Container className={" p-4"}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-600">All Contacts</h3>
        <Link
          to={"/add-contact"}
          className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <IoPersonAdd /> Add Contact
        </Link>
      </div>
      <div className="relative mt-5">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg
        className="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>
    <input
      type="search"
      id="default-search"
      onChange={changeHandler}
      className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Search contacts..."
      required=""
    />
  </div>
      <div className=" mt-5 flex flex-col gap-3">
        {contacts.length == 0 ? (
          <span className="text-center">No contact founds</span>
        ) : (
          contacts.map((contact, index) => (
            <div
              className="p-2 border rounded flex justify-between items-center "
              key={index}
            >
              <div className="flex items-center gap-3">
                <div className="w-[55px] h-[55px] rounded-full overflow-hidden">
                  <img src={contact.profile_image ? `${process.env.API_URL}/profile-images/${contact?.profile_image}` : UserProfile} alt="" />
                </div>
              <div className="flex flex-col">
                <Link to={`/contact-details/${contact._id}`}><span className="text-2xl font-semibold inline-block whitespace-nowrap text-ellipsis overflow-hidden w-[200px] md:w-full">{contact.name}</span></Link>
                <span>{contact.email}</span>
              </div>
              </div>
              <div className="flex gap-2 text-2xl">
                <Link to={`/edit-contact/${contact?._id}`}><FaUserEdit className="cursor-pointer" /></Link>
                <MdDelete onClick={()=>deleteHandler(contact?._id)} className="cursor-pointer" />
              </div>
            </div>
          ))
        )}
      </div>
    </Container>
  );
};

export default ContactList;
