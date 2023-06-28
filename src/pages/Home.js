import React, { useContext, useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";

import "../App.css";

import { Camera, Check } from "iconsax-react";
import Login from "./Login";
import { useOfficers } from "../hooks";
import { ToastSuccessRight } from "../common";

// "face-api.js": "^0.16.1",

const Home = (props) => {
  const [state, dispatch] = useOfficers();
  const auth = JSON.parse(localStorage.getItem("isAuth"));

  useEffect(() => {
    if (!auth) {
      props.history.push("/");
      document.querySelector(".show-modal").click();
    }
  }, [state.isAuth]);
  // useEffect(() => {
  //   let timeOut = setTimeout(() => {
  //     const UserInfor = JSON.parse(localStorage.getItem("UserInfor"));
  //     console.log(UserInfor)

  //     if (!UserInfor || Object.keys(UserInfor).length === 0) {
  //       props.history.push('/expired');
  //     }
  //   }, 100);
  //   return () => clearTimeout(timeOut);
  // }, []);

  const handleClick = (value) => {
    if (value === 0) {
      props.history.push("/camera");
    }
    if (value === 1) {
      props.history.push("/face-authentication");
    }
  };

  return (
    <div className="home content">
      <div className=" p-0 d-flex position-absolute home-content ">
        <div className="col-6 h-100 p-0 ">
          <button
            className=" h-100 w-100 bg-ss"
            onClick={() => handleClick(0)}
            title="Chấm công"
          >
            <Camera size="80" color="#FF8A65" />
          </button>
        </div>
        <div className="col-6 p-0">
          <button
            className=" h-100 w-100 bg-dg"
            onClick={() => handleClick(1)}
            title="Xác thực khuôn mặt"
          >
            <Check size="80" color="#FF8A65" />
          </button>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-info btn-round d-none show-modal"
        data-toggle="modal"
        data-target="#loginModal"
      >
        Login
      </button>
      <Login />
    </div>
  );
};

export default withRouter(Home);
