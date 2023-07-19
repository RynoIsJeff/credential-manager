import React from 'react';
import Login from './components/Login';
import Register from './components/Register';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  createBrowserRouter, RouterProvider

} from "react-router-dom"
import Dashboard from './components/dashboard/Dashboard';
import ErrorPage from './components/ErrorPage';
import AddCredential from './components/dashboard/AddCredential';
import AssignUserToDivision from './components/dashboard/AssignUserToDivision';
import ChangeUserRole from './components/dashboard/ChangeUserRole';
import DesignateUserFromOU from './components/dashboard/DesignateUserFromOU';
import UpdateCredential from './components/dashboard/UpdateCredential';
import ViewCredentialRepository from './components/dashboard/ViewCredentialRepository';
import { ApplicationProvider } from './state';
import DeAssignUserToDivision from './components/dashboard/DeAssignUserToDivision';
import DeAssignUserFromOU from './components/dashboard/DeAssignUserFromOU';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/add-credential",
        element: <AddCredential />
      },
      {
        path: "/update-credential/:credentialId",
        element: <UpdateCredential />
      },
      {
        path: "/assign-user-to-division",
        element: <AssignUserToDivision />
      },
      {
        path: "/de-assign-user-to-division",
        element: <DeAssignUserToDivision />
      },
      {
        path: "/de-assign-user-from-ou",
        element: <DeAssignUserFromOU />
      },
      {
        path: "/change-user-role",
        element: <ChangeUserRole />
      },
      {
        path: "/designate-user-from-ou",
        element: <DesignateUserFromOU />
      },
      {
        path: "/update-credential",
        element: <UpdateCredential />
      },
      {
        path: "/",
        element: <ViewCredentialRepository />
      },
    ]
  },
]);

function App() {
  return (
    <div>
      <ToastContainer />
      <ApplicationProvider>
        <RouterProvider router={router} />
      </ApplicationProvider>
    </div>
  );
}

export default App;
