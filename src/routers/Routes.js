import React from "react";
import { Route, Router } from "react-router-dom";
import Home from "../pages/Home";
import FaceAuthentication from "../pages/FaceAuthentication";
import FaceRecognition from "../pages/FaceRecognition";
import Header from "../components/Header";
import history from "./history";
import { Footer } from "../components/Footer";
import ReportImages from "../pages/ReportImages";
import { PrivateRoute } from "./PrivateRoutes";
import { AuthRoute } from "./AuthRoutes";
// import CameraFaceDetect from '../pages/CameraFaceDetect';
import CameraFaceDetectSingleSsd from "../pages/CameraFaceDetectSingleSsd";
// import CameraFaceDetectSingle from '../pages/CameraFaceDetectSingle';
// import CameraFaceDetectSingleMtcnn from '../pages/CameraFaceDetectSingleMtcnn';
import ManagerAccounts from "../pages/ManagerAccounts";
import UploadAudio from "../pages/UploadAudio";
import ImagesAuthentication from "../pages/ImagesAuthentication";
import   DataLocation  from "../pages/General/DataLocation";
import   DataPostOffice  from "../pages/General/DataPostOffice";
import   DataDeparment  from "../pages/General/DataDeparment";
import   DataOfficer  from "../pages/General/DataOfficer";
export const Routes = () => {
  // const UserInfor = JSON.parse(localStorage.getItem("UserInfor"));

  return (
    <Router history={history}>
      <div className="route">
        <Header />

        <Route exact path="/" component={Home} />
        <PrivateRoute
          exact
          path="/face-authentication"
          component={FaceAuthentication}
        />
        <AuthRoute exact path="/photo" component={FaceRecognition} />
        <AuthRoute exact path="/camera" component={CameraFaceDetectSingleSsd} />
        {/* <AuthRoute exact path="/camera2" component={CameraFaceDetectSingle} />
          <AuthRoute exact path="/camera3" component={CameraFaceDetect} />
          <AuthRoute exact path="/camera4" component={CameraFaceDetectSingleMtcnn} /> */}
        <PrivateRoute exact path="/accounts" component={ManagerAccounts} />
        <PrivateRoute exact path="/upload-audio" component={UploadAudio} />
        {/* <Route exact path="/expired" component={Expired} /> */}
        <PrivateRoute exact path="/report" component={ReportImages} />
        <PrivateRoute
          exact
          path="/report-authentication"
          component={ImagesAuthentication}
        />

        <AuthRoute exact path="/quan-ly-khu-vuc" component={DataLocation} />
        <AuthRoute exact path="/quan-ly-buu-cuc" component={DataPostOffice} />
        <AuthRoute exact path="/quan-ly-phong-ban" component={DataDeparment} />
        <AuthRoute exact path="/quan-ly-nhan-vien" component={DataOfficer} />

        <Footer />
      </div>
    </Router>
  );
};
