import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import AddCredential from './components/AddCredential';
import UpdateCredential from './components/UpdateCredential';
import ViewCredentialRepository from './components/ViewCredentialRepository';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Login />
      <Register />
      <AddCredential />
      <UpdateCredential credentialId="credentialId" />
      <ViewCredentialRepository />
      <ToastContainer />
    </div>
  );
}

export default App;
