import React, { useEffect, useState } from "react";
import { getContact } from "../../library/apiCalls";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container";
import { IoReturnUpBackOutline } from "react-icons/io5";
import UserProfile from "../assets/UserProfile_1.jpg";
import { useSelector } from "react-redux";

const ContactDetails = () => {
  const params = useParams();
  const user = useSelector(state=>state.user)
  const id = params.id;
  const [contact, setContact] = useState(null);
  const fetchContact = async () => {
    const response = await getContact(user?.data?._id,id);
    setContact(response);
  };
  useEffect(() => {
    fetchContact();
  }, []);
  return (
    <div>
      {contact && (
        <Container className={"p-5"}>
          <div className="flex justify-between items-center ">
            <h3 className="text-2xl font-bold text-gray-600">
              Contact Details
            </h3>
            <Link
              to={"/"}
              className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <IoReturnUpBackOutline className="text-xl font-bold" /> Back
            </Link>
          </div>
          <div className="mt-5 sm:mt-0 grid grid-cols-1 md:flex gap-3 items-center">
            <div className="w-[200px] h-[200px] mx-auto md:mx-0 rounded-full overflow-hidden">
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
            <div className="flex flex-col gap-1">
              <span>
                Name: <span className="text-xl italic">{contact?.name}</span>
              </span>
              <span>
                Email: <span className="text-xl italic">{contact?.email}</span>
              </span>
              <span>
                Contact:{" "}
                <span className="text-xl italic">+91 {contact?.contact}</span>
              </span>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default ContactDetails;
