import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./layout/Layout.jsx";
import AddConatct from "./pages/AddConatct.jsx";
import ContactDetails from "./pages/ContactDetails.jsx";
import EditContact from "./pages/EditContact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
            path:'/',
            element:<Home />
        },
        {
            path:'/add-contact',
            element:<AddConatct />
        },
        {
            path:'/contact-details/:id',
            element:<ContactDetails />
        },
        {
            path:'/edit-contact/:id',
            element:<EditContact />
        }
      ]
    },
    {
      path:'/login',
      element:<Login />
    },
    {
      path:'/register',
      element:<Register />
    },
  ]);
  return <RouterProvider router={routes} />;
};

export default App;
