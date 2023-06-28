import React, { Component, useEffect, useState } from 'react';

import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import {OfficerProvider} from './store';
import { Routes } from './routers';


const  App = () => {

    return (
      <OfficerProvider>
      <div className="App">
        <Routes/>
        <ToastContainer />
      </div>
      </OfficerProvider>
      
    );
  
}

export default App;
