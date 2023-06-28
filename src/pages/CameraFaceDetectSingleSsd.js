import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import Webcam from "react-webcam";
import { loadModels, createMatcher, getFaceDescriptionSsd } from "../api/face";
import "../App.css";
import { LogTimeSheet } from "../components";
import { callApi, IMAGES_DOMAIN } from "../services/Api";
import { useOfficers, useAudio, RunAudio } from "../hooks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { usePalette } from "react-palette";
import DrawBoxSingle from "../components/DrawBoxSingle";
import { FormatDate, ToastError, VnToEn } from "../common";

const WIDTH = 940;
const HEIGHT = 660;
const inputSize = 512;
// by 32, common sizes are 128, 160, 224, 320, 416, 512, 608,

const CameraFaceDetectSingleSsd = (props) => {
  const [srcc, setSrcc] = useState("");
  const { data, loading, error } = usePalette(srcc);
  const [officers, dispatch] = useOfficers();
  const [historyLog, setHistoryLog] = useLocalStorage("log", []);
  const [curentPeopleLog, setCurentPeopleLog] = useLocalStorage(
    "currentPeople",
    []
  );

  const [fullDesc, setFullDesc] = useState(null);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [facingMode, setFacingMode] = useState(null);
  const webcam = useRef();
  const [handleShowCapture, setHandleShowCapture] = useState(false);
  const [Log, setLog] = useState([]);
  const [newPeople, setNewPeople] = useState(false);
  const [countFaceMatch, setCountFaceMatch] = useState(0);
  const [faceName, setFaceName] = useState("");
  const [waitChecked, setWaitChecked] = useState(false);
  const [cameraRunning, setCameraRunning] = useState(false);
  const [isHandleTimekeeping, setIsHandleTimekeeping] = useState(false);

  const [urlAction, setUrlAction] = useState("./audio/ok.mp3");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const role = JSON.parse(localStorage.getItem("role"));
    if (role === "deployment") {
      props.history.push("/");
    }
  }, []);

  // tự động cuộn xuống trong danh sách chấm công
  const listRef = useRef(null);
  useEffect(() => {
    listRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [Log]);

  //load models
  useEffect(() => {
    officers.officers.length > 0 && runModels();
  }, [officers]);

  useEffect(() => {
    let interval = setInterval(() => {
      !newPeople && capture();
    }, 500);

    return () => clearInterval(interval);
  }, [handleShowCapture]);

  useEffect(() => {
    let interval2 = setInterval(() => {
      waitChecked && setWaitChecked(false);
    }, 3000);

    return () => clearInterval(interval2);
  }, [waitChecked]);

  useEffect(() => {
    let interval3 = setInterval(async () => {
      const currentPeople = JSON.parse(localStorage.getItem("currentPeople"));
      await CPN_spTimeKeepingHistory_Save_Agan(currentPeople);
    }, 300000);
    return () => clearInterval(interval3);
  }, []);

  //load model
  const runModels = () => {
    loadModels();
    matcher();
    setInputDevice();
    handleDataToJson(officers.officers);
    createLog();
  };

  // lịch sử chấm công trong ngày
  const createLog = () => {
    if (historyLog.length > 0) {
      let d1 = new Date(historyLog[0].date);
      let d2 = new Date();
      if (isSameDay(d1, d2)) {
        setLog([...historyLog]);
      } else {
        setLog([]);
      }
      return;
    }
    setLog([]);
  };

  // lấy thông tin camera
  const setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (inputDevice.length < 2) {
        await setFacingMode("user");
      } else {
        await setFacingMode({ exact: "environment" });
      }
      await setHandleShowCapture(true);
    });
  };

  // xử lý dữ liệu khuôn mặt lấy từ db
  const handleDataToJson = (data) => {
    let getObj = Object.values(data).flat(Infinity);
    let getArr = getObj.map((item) => {
      let splitArr = item.DescriptorOfFace.split(",").map((item) =>
        parseFloat(item)
      );
      let face1 = splitArr.slice(0, 128);
      let face2 = splitArr.slice(128, 256);
      let face3 = splitArr.slice(256, 384);
      let des = [face1, face2, face3];

      return {
        name: item.OfficerName,
        id: item.OfficerID,
        image: item.Avatar,
        descriptors: des,
      };
    });
    const result = getArr.reduce(
      (obj, cur) => ({ ...obj, [cur.name]: cur }),
      {}
    );
    // let json = result.replaceAll('"[',"[").replaceAll(']"', "]");
    return result;
  };

  //khởi tạo khuôn mặt
  const matcher = async () => {
    const faceMatcher = await createMatcher(
      handleDataToJson(officers.officers)
    );
    setFaceMatcher(faceMatcher);
  };

  //lấy hình ảnh từ camera
  const capture = async () => {
    if (!!webcam.current) {
      await getFaceDescriptionSsd(
        webcam.current.getScreenshot(),
        inputSize
      ).then((fullDesc) => setFullDesc(fullDesc));
      webcam.current?.getScreenshot() &&
        (await getUrlImage(webcam.current.getScreenshot()));
    }
  };

  let videoConstraints = null;
  if (!!facingMode) {
    videoConstraints = {
      width: WIDTH,
      height: HEIGHT,
      facingMode: facingMode,
    };
  }

  //chuyển đổi màu từ hex => rgb
  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  //khoảng cách từ màu chủ đạo trong hình so với màu xanh ( áo netco)
  const distanceColor = (rgb1 = { r: 0, g: 255, b: 0 }, rgb2) => {
    if (!rgb1) return;
    let r = Math.abs(rgb1.r - rgb2.r) / 255;
    let g = Math.abs(rgb1.g - rgb2.g) / 255;
    let b = Math.abs(rgb1.b - rgb2.b) / 255;
    let distance = ((r + g + b) / 3) * 100;
    return distance;
  };

  // lấy link blob hình ảnh
  const getUrlImage = async (src) => {
    let myImg = new Image();
    let blob = await fetch(src)
      .then((r) => r.blob())
      .catch((error) => console.log(error));
    if (!!blob && blob.type.includes("image")) {
      myImg.src = URL.createObjectURL(blob);
      await setSrcc((pre) => myImg.src);
    }
  };

  // chuyển từ link blob qua file
  const urltoFile = (url, filename, mimeType) => {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || "")[1];
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  };

  const canvasRef = useRef(null);

  // xử lý nhận dạng khuôn mặt, đúng 7 lần thì cho chấm công, mỗi lần chấm cách nhau 10p
  const handleMatch = async (item) => {
    if (Object.keys(item).length > 0) {
      if (item._label !== "unknown") {
        if (faceName.length === 0) {
          await setFaceName(item._label);

          setCountFaceMatch(1);
        } else {
          if (faceName !== item._label) {
            await setFaceName(item._label);

            setCountFaceMatch(1);
          } else {
            setCountFaceMatch(countFaceMatch + 1);
          }
        }

        // 2 lần đúng thì cho chấm công
        if (countFaceMatch === 2) {
          setNewPeople(true);
          const user = Object.values(officers)[0].find(
            (officer) => officer.OfficerName === item._label
          );
          const getUserTimeKeeped = Log.filter(
            (log) => log._label === item._label
          );

          if (getUserTimeKeeped) {
            // check 3p mới cho chấm công tiếp
            let d = new Date();
            let tenMinutes = 60 * 1000 * 10;

            let time =
              getUserTimeKeeped.length > 0
                ? getUserTimeKeeped[getUserTimeKeeped.length - 1].date +
                  " " +
                  getUserTimeKeeped[getUserTimeKeeped.length - 1].time
                : "";
            let timeNow =
              d.getMonth() +
              1 +
              "/" +
              d.getDate() +
              "/" +
              d.getFullYear() +
              " " +
              (("0" + d.getHours()).slice(-2) +
                ":" +
                ("0" + d.getMinutes()).slice(-2) +
                ":" +
                ("0" + d.getSeconds()).slice(-2));
            let d1 = new Date(timeNow).getTime();
            let d2 = new Date(time).getTime();
            user.time = timeNow;

            if (d1 - (d2 + tenMinutes) < 0) {
              await setCountFaceMatch(0);
              setNewPeople(false);
              return;
            }
          }

          setCountFaceMatch(0);
          await setWaitChecked(true);
          await SaveImagesTimeKeeping(user, item);
          setNewPeople(false);
        }
      } else {
        setNewPeople(true);
        setCountFaceMatch(0);
        setFaceName("");
        setFullDesc(null);
        setWaitChecked(false);
      }
    }
  };

  //luu hinh cham cong
  const SaveImagesTimeKeeping = async (user, userCheck) => {
    setIsHandleTimekeeping(true);
    let newDate = new Date();
    let fileName = `${VnToEn(user.OfficerName)}_${
      user.OfficerCode
    }_${FormatDate(newDate, 3)}.png`;
    let officer = `${VnToEn(user.OfficerName)}_${user.OfficerCode}`;
    try {
      //luu file
      let fileImage = await urltoFile(srcc, fileName).then(function (file) {
        return file;
      });
      const formData = new FormData();
      formData.append("file", fileImage);
      formData.append("OfficerName", officer);
      const res = await callApi.PostImages(formData);
      let linkImages = res
        .replace('"', "")
        .replace('"', "")
        .replace("[", "")
        .replace("]", "");
      user.link = linkImages;

      //luu log
      let arr = [],
        date = new Date();
      let timeNow =
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2) +
        ":" +
        ("0" + date.getSeconds()).slice(-2);
      let checkCompanyShirt = await distanceColor(hexToRgb(data.vibrant), {
        r: 0,
        g: 255,
        b: 0,
      });
      console.log(checkCompanyShirt);
      let shirt = checkCompanyShirt > 44 ? "Không đồng phục" : "Có đồng phục";

      userCheck.time = timeNow;
      userCheck.date =
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      userCheck.avatar = IMAGES_DOMAIN + linkImages;
      userCheck.text = `Đã chấm công - ${shirt}`;
      arr.push(userCheck);
      const logList = [...Log, ...arr];

      //phat am thanh
      setShow(false);
      user?.LinkAudio
        ? setUrlAction(`https://mediaimages.vps.vn/${user.LinkAudio}`)
        : setUrlAction("./audio/ok.mp3");
      // let id = listUrl.filter(item => +item.split('/').pop().split('.')[0] === +user.OfficerID)
      // id.length > 0 ? setUrlAction(id[0]) : setUrlAction(listUrl[0])
      setShow(true);

      setCurentPeopleLog([...curentPeopleLog, user]);
      setIsHandleTimekeeping(false);
      await CPN_spTimeKeepingHistory_Save(user, linkImages);
      handleSaveLogLocal(logList, arr);
    } catch (error) {
      setIsHandleTimekeeping(false);
      console.log(error, "error");
      ToastError("Có lỗi xảy ra, liên hệ IT netco");
    }
  };

  //lưu lịch sử chấm công
  const CPN_spTimeKeepingHistory_Save = async (user, link) => {
    try {
      const params = {
        Json: JSON.stringify({
          Id: 0,
          OfficerId: user.OfficerID,
          OfficerName: user.OfficerName,
          LinkImage: link,
          role: officers.role,
        }),
        func: "CPN_spTimeKeepingHistory_Save",
        API_key: "netcoApikey2025",
      };
      const res = await callApi.Main(params);
      let removeCurent = curentPeopleLog.filter(
        (item) => item.OfficerID !== user.OfficerID
      );
      setCurentPeopleLog(removeCurent);

      // document.querySelector('#play-sound').click();
    } catch (error) {
      console.log(error);
      ToastError("Có lỗi xảy ra, liên hệ IT netco");
    }
  };

  //lưu lịch sử chấm công khi bi miss
  const CPN_spTimeKeepingHistory_Save_Agan = async (data) => {
    try {
      for (let index = 0; index < data.length; index++) {
        const user = data[index];
        const params = {
          Json: JSON.stringify({
            Id: 0,
            OfficerId: user.OfficerID,
            OfficerName: user.OfficerName,
            LinkImage: user.link,
          }),
          func: "CPN_spTimeKeepingHistory_Save",
          API_key: "netcoApikey2025",
        };
        const res = await callApi.Main(params);
        let removeCurent = data.filter(
          (item) => item.OfficerID !== user.OfficerID
        );
        setCurentPeopleLog(removeCurent);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth()
    );
  };

  // lưu lại log vào local
  const handleSaveLogLocal = (dataLog, arr) => {
    if (dataLog.length > 0) {
      let date = new Date(dataLog[0].date);
      let dateNow = new Date();

      if (isSameDay(date, dateNow)) {
        setHistoryLog(dataLog);
        setLog(dataLog);
        setFaceName("");
        setCountFaceMatch(0);
      } else {
        setHistoryLog(arr);
        setLog(arr);
        setFaceName("");
        setCountFaceMatch(0);
      }
    }
  };

  return (
    <div className="Camera content ">
      <div className="d-flex box-content h-100">
        <div className="p-0 flex-grow-3 pl-2 h-100">
          {/* <div style={{ width: 200, height: 20, backgroundColor: data.vibrant }}> asdhkjashdkjashdkjashdkajshd</div> */}
          <div style={{ position: "relative", width: WIDTH }} class="webcam">
            {!!videoConstraints ? (
              <div style={{ position: "absolute" }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!fullDesc &&
            !waitChecked &&
            cameraRunning &&
            !isHandleTimekeeping ? (
              <DrawBoxSingle
                fullDesc={fullDesc}
                faceMatcher={faceMatcher}
                imageWidth={WIDTH}
                boxColor={"blue"}
                onMatch={handleMatch}
                // showLabel={false}
              />
            ) : null}
          </div>
          <canvas id="canvas" className="d-none" ref={canvasRef}></canvas>
        </div>
        <div className="box-notification flex-grow-1">
          <div className="box-notification-content ">
            <div className="box-notification-content-title text-center">
              <h3 className="text-muted">
                <button
                  className={
                    cameraRunning
                      ? "btn btn-danger btn-sm mr-2"
                      : "btn btn-info btn-sm mr-2"
                  }
                  onClick={() => {
                    setCameraRunning(!cameraRunning);
                    setCountFaceMatch(0);
                  }}
                >
                  {cameraRunning ? "Tắt chấm công" : "Bật chấm công"}
                </button>
                Lịch sử chấm công
              </h3>
            </div>
            <div className="box-notification-content-body ">
              <ul className="notification-content__list p-0">
                {Log.map((item, index) => (
                  <LogTimeSheet employee={item} key={index} />
                ))}
                <div id={"el"} ref={listRef}></div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='d-none'>
        
        <button onClick={toggle} id='play-sound'></button>
      </div> */}
      {show && <RunAudio url={urlAction} click={show} />}
      {/* <MultiPlayer
        urls={ listUrlAudio}
      /> */}
    </div>
  );
};

export default withRouter(CameraFaceDetectSingleSsd);
