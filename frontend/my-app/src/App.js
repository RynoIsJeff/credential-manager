import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Login />
      <Register />
    </div>
  );
}

export default App;
