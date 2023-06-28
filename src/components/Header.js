import {
  AudioSquare,
  Camera,
  Check,
  HambergerMenu,
  Home2,
  Image,
  Logout,
  MoneyTime,
  User,
  ChartCircle,
  DeviceMessage,
} from "iconsax-react";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../App.css";
import { useOfficers } from "../hooks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { callApi } from "../services/Api";
import {
  setOfficerList,
  setPostLocation,
  setPostName,
  setRole,
  set_isAuth,
} from "../store";
import { withRouter } from "react-router-dom";
import Login from "../pages/Login";
import { accounts } from "../descriptors/account";
import Avatar from "../img/bg-camera.gif";
import { SelectPost, ToastErrorRight, ToastWarningRight } from "../common";

const Header = (props) => {
  const [state, dispatch] = useOfficers();
  const [loginDay, setLoginDay] = useLocalStorage("LoginDay", "");
  const [isAuth, setIsAuth] = useLocalStorage("isAuth", false);
  const [post, setPost] = useLocalStorage("postLocation", "");
  const [roleLocal, setRoleLocal] = useLocalStorage("role", "user");
  const [postNameLocal, setPostNameLocal] = useLocalStorage("postName", "");
  const [PostId, setPostId] = useState(state.postLocation || 0);
  const [fullPost, setFullPost] = useState();
  const [token, setToken] = useLocalStorage("token", "");
  const [postLogin, setPostLogin] = useLocalStorage("postLogin", 0);

  useEffect(() => {
    CPN_spOfficerWithDescriptor_List(state.postLocation);
  }, [state.postLocation]);

  useEffect(() => {
    let interval = setInterval(() => {
      if (state?.isAuth) {
        CPN_spOfficerWithDescriptor_List(state.postLocation);
      }
    }, 30000000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      let tokenLocal = JSON.parse(localStorage.getItem("token"));
      let postLog = JSON.parse(localStorage.getItem("postLogin"));

      if (state?.isAuth && state.role === "user") {
        CPN_spTimeKeeping_Login_Check(tokenLocal, postLog);
      }
    }, 300000);
    return () => clearInterval(interval);
  }, [state.isAuth]);

  // useEffect(() => {
  //   checkLoginDay()
  //   let interval = setInterval(() => {
  //     state?.isAuth && checkLoginDay()
  //   }, 360000);
  //   return () => clearInterval(interval);
  // }, [ state.isAuth]);

  useEffect(() => {
    if (!state.isAuth) {
      props.history.push("/");
      document.querySelector(".show-modal").click();
    }
  }, [state.isAuth]);

  // kiểm tra ngày đăng nhập
  const checkLoginDay = () => {
    const loginTime = JSON.parse(localStorage.getItem("LoginDay"));
    // props.history.push('/expired');
    let today = new Date().toLocaleDateString();

    if (!loginTime || loginTime?.length === 0) {
      setLoginDay(today);
      return;
    }

    let Weed = 7 * 24 * 60 * 60 * 1000;
    let currentDate = new Date(loginTime).getTime();
    let nowDate = new Date(today).getTime();
    if (currentDate + Weed < nowDate) {
      handleLogout();
      return;
    }
  };

  //lấy danh sách dữ liệu khuôn mặt của nhân viên
  const CPN_spOfficerWithDescriptor_List = async (post) => {
    try {
      const params = {
        Json: JSON.stringify({
          PostId: post,
          Types: 0,
        }),
        func: "CPN_spOfficerWithDescriptor_List",
        API_key: "netcoApikey2025",
      };
      const res = await callApi.Main(params);
      const filterRes = res.length
        ? res.filter((item) => item.DescriptorOfFace.length > 0)
        : [];
      dispatch(setOfficerList(filterRes));
    } catch (error) {
      console.log(error);
      ToastWarningRight("Không thể lấy dữ liệu của bưu cục");
      ToastErrorRight("Có lỗi xảy ra, vui lòng liên hệ IT NETCO");
    }
  };

  const randToken = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const CPN_spTimeKeeping_Login_Check = async (tokenlocal, postLog) => {
    const genToken = randToken();

    try {
      const pr = {
        Json: JSON.stringify({
          PostId: postLog,
          Token: tokenlocal,
          NewToken: genToken,
        }),
        func: "CPN_spTimeKeeping_Login_Check",
        API_key: "netcoApikey2025",
      };
      const res = await callApi.Main(pr);
      if (res.Status === "OK") {
        setToken(genToken);
        return;
      }
      handleLogout();
    } catch (error) {
      console.log(error);
    }
  };

  const InforUserLogin = () => {
    if (state.isAuth) {
      let info =
        state.role === "user"
          ? accounts[1]
          : state.role === "itvip"
          ? accounts[0]
          : accounts[2];
      return (
        <div className="d-flex justify-content-center align-items-center">
          <div className="mr-3 name-login text-muted text-uppercase">
            {info.UserName}
          </div>
          <img src={Avatar} alt="avatar" className="avatar-login" />
        </div>
      );
    }
    return <></>;
  };

  const handleLogout = (e) => {
    setLoginDay("");
    setIsAuth(false);
    dispatch(set_isAuth(false));
    dispatch(setRole("user"));
    setPost(0);
    setRoleLocal("user");
    dispatch(setPostLocation(0));
    setPostNameLocal("");
    dispatch(setPostName(""));
    setPostLogin(0);
    document.querySelector(".show-modal").click();
  };

  const handleChangePost = (e) => {
    setPostId(e.value);
    setFullPost(e);
  };

  const confirmChange = () => {
    setPost(fullPost.value);
    dispatch(setPostLocation(fullPost.value));
    setPostNameLocal(fullPost.label);
    dispatch(setPostName(fullPost.label));
    document.querySelector(".close").click();
  };

  return (
    <>
      <nav class="navbar navbar-expand-lg  navbar-background ">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex justify-content-center">
            <Link to="/">
              <div class="logo nav-brand"></div>
            </Link>

            {/* {state.isAuth && (
              <>
                <div className="d-flex justify-content-center align-items-center ml-4 ">
                  <span className="font-weight-bold ">{state.postName}</span>
                </div>
                <button
                  className="btn btn-outline-success ml-2 font-weight-bold d-none d-sm-none d-md-block"
                  data-toggle="modal"
                  data-target="#changePost"
                >
                  Thay đổi bưu cục chấm công
                </button>
              </>
            )} */}
          </div>
          <div className="nav-item ">
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <HambergerMenu size="32" class="text-success" />
            </button>
          </div>
          <div class="nav-item  d-none d-sm-none d-md-none d-lg-block">
            <InforUserLogin />
          </div>
        </div>

        <div class="collapse navbar-collapse " id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto flex-column vertical-nav navbar-background nav-item  ">
            <li class="nav-item ">
              <NavLink
                to="/"
                title="Trang chủ"
                exact={true}
                activeClassName="is-active"
                className="d-flex align-items-center "
              >
                <Home2 size="32" className="nav-item-color " />
                <span className="navbar-vertical__extent">Trang chủ</span>
              </NavLink>
            </li>

            {state.role !== "deployment" && (
              <li class="nav-item">
                <NavLink
                  to="/camera"
                  title="Chấm công"
                  activeClassName="is-active"
                >
                  <Camera size="32" />
                  <span className="navbar-vertical__extent">Chấm công</span>
                </NavLink>
              </li>
            )}

            {(state.role === "itvip" || state.role === "deployment") && (
              <>
                <li class="nav-item" title="Xác thực khuôn mặt">
                  <NavLink
                    to="/face-authentication"
                    activeClassName="is-active"
                  >
                    <Check size="32" />
                    <span className="navbar-vertical__extent">
                      Xác thực (camera)
                    </span>
                  </NavLink>
                </li>
                {state.role === "itvip" && (
                  <>
                    <li class="nav-item">
                      <NavLink
                        to="/report"
                        title="báo cáo"
                        activeClassName="is-active"
                      >
                        <Image size="32" />
                        <span className="navbar-vertical__extent">Báo cáo</span>
                      </NavLink>
                    </li>
                  </>
                )}
                <li class="nav-item">
                  <NavLink
                    to="/accounts"
                    title="Quản lý tài khoản"
                    activeClassName="is-active"
                  >
                    <User size="32" />
                    <span className="navbar-vertical__extent">
                      Q.lý tài khoản
                    </span>
                  </NavLink>
                </li>
                <li class="nav-item">
                  <NavLink
                    to="/upload-audio"
                    title="Thêm âm thanh"
                    activeClassName="is-active"
                  >
                    <AudioSquare size="32" />
                    <span className="navbar-vertical__extent">
                      Thêm âm thanh
                    </span>
                  </NavLink>
                </li>
                <li class="nav-item">
                  <NavLink
                    to="/report-authentication"
                    title="Xem lại hình ảnh xác thực"
                    activeClassName="is-active"
                  >
                    <MoneyTime size="32" />
                    <span className="navbar-vertical__extent">Xác thực</span>
                  </NavLink>
                </li>
              </>
            )}

            {/* <li class="nav-item">
            <Link to="/photo">
              <Image size="32" />
            </Link>
          </li> */}
            <li class="nav-item logout w-100 margin-top-20">
              <div onClick={(e) => handleLogout()}>
                <Logout size="32" />
                <span className="navbar-vertical__extent">Đăng xuất</span>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* modal login */}
      <button
        type="button"
        class="btn btn-info btn-round d-none show-modal"
        data-toggle="modal"
        data-target="#loginModal"
      >
        Login
      </button>
      <Login />

      <div
        class="modal fade"
        id="changePost"
        tabindex="-1"
        role="dialog"
        aria-labelledby="changePostOfffice"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content modal-login p-3">
            <div class="modal-header border-bottom-0 position-relative">
              <div className="d-flex flex-column align-items-center justify-content-center w-100 ">
                <h4 class="modal-title mt-3 title-login" id="changePostOfffice">
                  Thay đổi bưu cục chấm công
                </h4>
              </div>
              <button
                type="button"
                class="close position-absolute btn-close d-flex align-items-center justify-content-center"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-style">
                <div class="form-group ">
                  <div class="input-group">
                    <SelectPost
                      AreaId={0}
                      onSelected={(e) => handleChangePost(e)}
                      onPost={PostId}
                      isNewStyle={true}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                  onClick={confirmChange}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(Header);
