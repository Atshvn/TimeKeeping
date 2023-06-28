
import React, { useContext, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { loadModels, createMatcher,  getFaceDescriptionSsdBlob } from '../api/face';
import '../App.css';
import { callApi } from '../services';
import { ToastErrorRight, ToastSuccess, ToastWarningRight, AlertConfirm, AlertConfirm2, SelectOfficerList, SelectPost, JSON_PROFILE } from '../common';
import { setOfficers } from '../store';
import { useOfficers } from '../hooks';
import { Link } from 'react-router-dom';
import DrawBoxSingle from '../components/DrawBoxSingle';
import { BackSquare, SaveAdd } from 'iconsax-react';

const WIDTH = 400;
const HEIGHT = 500;
const inputSize = 320;
// "face-api.js": "^0.16.1",

const FaceAuthentication = (props) => {

  const [states, dispatch] = useOfficers()

  const [fullDesc, setFullDesc] = useState(null);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [facingMode, setFacingMode] = useState(null);
  const webcam = useRef();
  const [handleShowCapture, setHandleShowCapture] = useState(false);
  const [officerId, setofficerId] = useState(0);
  const [PostId, setPostId] = useState(-1);
  const [classCamera, setClassCamera] = useState('col-12 animate__animated  animate__bounce  animate__zoomInDown');
  const [classInfor, setClassInfor] = useState('d-none');
  const [showCamera, setShowCamera] = useState('d-none');
  const [overlayCamera, setOverlayCamera] = useState('overlay-camera2'); //overlay-camera2
  const [descriptor, setDescriptor] = useState([]);
  const [showDraBox, setShowDraBox] = useState(true);
  const [documentCheck, setDocumentCheck] = useState({ text: '', show: 'opacity-0' });
  const [passFarFace, setPassFarFace] = useState(false);
  const [passNearFace, setPassNearFace] = useState(false);
  const [images, setImages] = useState([]);
  const [blob, setBlob] = useState('');
  const [hinddenCamera, setHinddenCamera] = useState(false);


  // Thông báo
  useEffect(() => {
    let auth = JSON.parse(localStorage.getItem('isAuth'));
    auth && AlertConfirm(
      'Thông báo',
      `Trước khi xác thực khuôn mặt, vui lòng cởi bỏ khẩu trang, di chuyển khuôn mặt vào giữa camera.
      Đảm bảo không gian đủ ánh sáng.`,
      () => callbackNotification()
    )

  }, [states.isAuth]);

  // load models
  const callbackNotification = () => {
    setShowCamera('')
    loadModels();
    matcher();
    setInputDevice();
    setDocumentCheck({ text: 'Di chuyển khuôn mặt vừa với khung hình', show: 'animate__animated animate__jackInTheBox' })
  }

  // call 
  useEffect(() => {
    let interval = setInterval(() => {
      capture();
    }, 3000);
    return () => clearInterval(interval);
  }, [handleShowCapture]);

  useEffect(() => {
    if (images.length === 3) {
      setHinddenCamera(true)
    }
  }, [images]);

  // set thiết bị
  const setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      if (inputDevice.length < 2) {
        await setFacingMode('user');

      } else {
        await setFacingMode({ exact: 'environment' });

      }
      await setHandleShowCapture(true);
    });

  };

  // xử lý dữ liệu khuôn mặt lấy từ db
  const handleDataToJson = (data) => {
    let getObj = Object.values(data).flat(Infinity);
    let getArr = getObj.map(item => {

      let splitArr = item.DescriptorOfFace.split(',').map(item => parseFloat(item));
      let des = [splitArr.slice(0, 128), splitArr.slice(128, 256), splitArr.slice(256, 384)];

      return {
        name: item.OfficerName,
        id: item.OfficerID,
        image: item.Avatar,
        descriptors: des
      }
    })
    const result = getArr.reduce((obj, cur) => ({ ...obj, [cur.name]: cur }), {})
    // let json = result.replaceAll('"[',"[").replaceAll(']"', "]");
    return result;
  }

  // matcher
  const matcher = async () => {
    let dataMatch = states.officers.length > 0 ? handleDataToJson(states.officers) : JSON_PROFILE;
    const faceMatcher = await createMatcher(dataMatch);
    setFaceMatcher(faceMatcher);
  };

  // capture
  const capture = async () => {
    if (!!webcam.current) {
      let { fullDesc, blob } = await getFaceDescriptionSsdBlob(
        webcam.current.getScreenshot(),
        inputSize
      )
      await setFullDesc(fullDesc)
      await setBlob(blob)
    }
  };


  // lấy link blob hình ảnh
  const getUrlImage = async (src) => {
    let myImg = new Image();
    let bl = await fetch(src)
      .then(r => r.blob())
      .catch(error => console.log(error));
    if (!!bl && bl.type.includes('image')) {
      myImg.src = URL.createObjectURL(bl)

      return myImg.src
    } else {
      return false
    }


  }

  // chuyển từ link blob qua file
  const urltoFile = (url, filename, mimeType) => {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

  let videoConstraints = null;
  let camera = '';
  if (!!facingMode) {
    videoConstraints = {
      width: WIDTH,
      height: HEIGHT,
      facingMode: facingMode
    };
    if (facingMode === 'user') {
      camera = 'Front';
    } else {
      camera = 'Back';
    }
  }

  // event xác thực thành công
  const finishGetFace = () => {
    ToastSuccess('Xác thực thành công');
    document.querySelector('#confirm-register').click();
    setShowDraBox(false)
  }

  // event khởi tạo lại xác thực
  const resetGetFace = () => {
    setShowDraBox(true)
    setShowCamera('')
    setDescriptor([])
    setClassCamera('col-12 animate__animated  animate__bounce  animate__zoomInDown')
    setClassInfor('d-none')
    setOverlayCamera('overlay-camera2')
    setDocumentCheck({ text: '', show: 'opacity-0' })
    setPassFarFace(false)
    setPassNearFace(false)
    setofficerId(0)
    setPostId(-1)
    setHinddenCamera(false)
    setImages([])
    setBlob('')
  }

  // xử lý kiểm tra khuôn mặt gần, xa
  const handleCheckFace = async (item, des, w, h, bl) => {
   
    if (!passFarFace && descriptor.length === 0) {
      setDocumentCheck({ text: '', show: 'opacity-0' });
      if (w > 180 || h > 160) {
        setDocumentCheck({
          text: 'Di chuyển khuôn mặt vừa với khung hình',
          show: 'animate__animated animate__tada'
        });
        return;
      }
      let isImage = await getUrlImage(bl);
      if (!isImage) {
        return;
      }

      let pass = await handleCreateFace(item, des, w, h);
      if(pass){
       await setImages([...images, isImage]);
      await setOverlayCamera('overlay-camera');
      await setPassFarFace(true);
      }
      

    }

    if (!passNearFace ) {
      setDocumentCheck({ text: '', show: 'opacity-0' });
      if (w < 250 || h < 240) {
        setDocumentCheck({
          text: 'Tiếp tục di chuyển khuôn mặt vừa với khung hình',
          show: 'animate__animated animate__zoomInDown'
        });
        return;
      }
      let isImage = await getUrlImage(bl);
      if (!isImage) {
        return;
      }
      await setImages([...images, isImage]);
      await handleCreateFace(item, des, w, h);
    }
  }

  // khởi tạo khuoon mặt
  const handleCreateFace = (item, des, w, h) => {

    let face = [];
    face.push(des);
   
    descriptor.length <= 2 && setDescriptor([...descriptor, face]);

    if (descriptor.length === 2) {
      finishGetFace()
      return;
    }
    return true

  }

  //danh sách description của officer
  const CPN_spOfficerWithDescriptor_List = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          PostId: 0,
          Types: 0
        }),
        func: "CPN_spOfficerWithDescriptor_List",
        API_key: "netcoApikey2025"
      }
      const res = await callApi.Main(params);
      const filterRes = res.filter(item => item.DescriptorOfFace.length > 0 && item.OfficerID === officerId);
      dispatch(setOfficers(filterRes))

    } catch (error) {
      console.log(error);
    }

  }

 

  const uploadImageAuth = async () => {
    try {
      const formData = new FormData();

      for (let i = 0; i < images.length; i++) {
        let file = await urltoFile(images[i], `image${i}.png`);
        formData.append(`file${i}`, file);
      }
      await formData.append('Code', 'TimeKeeping');

      const res = await callApi.Upload(formData);
      const linkFile = res?.replaceAll('"', '')
        .replaceAll('\\\\', '/')
        .replaceAll('[', '')
        .replaceAll(']', '')
        .replaceAll(',', ';');

      return linkFile;
    } catch (error) {
      console.log(error);
      ToastErrorRight('Có lỗi xảy ra, vui lòng thử lại sau')
    }

  }

  // lưu dữ liệu khuôn mặt theo nhân viên
  const CPN_spOfficerDesciptor_Save = async () => {

    if (PostId === 0 || PostId === -1) {
      ToastWarningRight('Vui lòng chọn bưu cục');
      return;
    }
    if (officerId === 0) {
      ToastWarningRight('Vui lòng chọn nhân viên');
      return;
    }

    try {

      let imagesOfFace = await uploadImageAuth();
      const params = {
        Json: JSON.stringify({
          Id: 0,
          OfficerId: officerId,
          Descriptor: '' + descriptor,
          ImagesOfFace: imagesOfFace
        }),
        func: "CPN_spOfficerDesciptor_Save",
        API_key: "netcoApikey2025"
      }
      const res = await callApi.Main(params);
      ToastSuccess(`${res.ReturnMess}`);
      AlertConfirm2(
        'Thông báo',
        `Xác thực thành công`,
        'Chấm công ngay',
        'Tiếp tục xác thực',
        () => {
          document.querySelector('#camera').click()
          CPN_spOfficerWithDescriptor_List()
        },
        () => resetGetFace()
      )

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="wrap content">
      <div className={`row box-content camera mr-0 ${showCamera}`} >
        <div className={hinddenCamera ? 'd-none' : `p-0  d-flex justify-content-center camera-box h-90 ${classCamera}`}>
          <div
            style={{ position: 'relative', width: WIDTH }}
            class='webcam'
          >
            <div className={`d-flex justify-content-center document-check ${documentCheck.show} `}>
              {documentCheck.text}
            </div>
            <button
              onClick={e => {
                setClassInfor('animate__animated animate__bounce  animate__bounceInRight')
                setClassCamera('col-7 animate__animated  animate__bounce  animate__jackInTheBox')
              }}
              id="confirm-register"
              className="d-none"
            >
              Xác nhận
            </button>
            <Link to="/camera" id='camera' className='d-none' />


            {!!videoConstraints ? (
              <div
                style={{ position: 'absolute' }}
                className={`${overlayCamera}  ${showCamera}`}
              >
                <Webcam
                  audio={false}
                  width={400}
                  height={500}
                  ref={webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}

                />
                {/* <button onClick={capturee}>Capture photo</button>
                {imgSrc && (
                  <img src={imgSrc} alt='people' />
                )} */}
              </div>
            ) : null}
            {!!fullDesc && showDraBox ? (
              <DrawBoxSingle
                fullDesc={fullDesc}
                faceMatcher={faceMatcher}
                imageWidth={WIDTH}
                onMatch={handleCheckFace}
                showLabel={false}
                bl={blob}
              />
            ) : null}
          </div>

        </div>
        <div className={`box-setting col-12 ${classInfor} `} >
          <div className="box-setting-content d-flex flex-column justify-content-center">
            <div className="box-setting-content-title text-center mt-2">
              <h3 className='text-muted '>Thông tin nhân viên</h3>
            </div>
            <div className="box-setting-content-body row ml-2 justify-content-center">
              <div class="col-sm-5 col-md-5 ">
                <div class="form-group">
                  <label class="mb-0">Bưu cục<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                  <div class="input-group">
                    <SelectPost
                      AreaId={0}
                      onSelected={e => {
                        setPostId(e.value)
                        setofficerId(0)
                      }}
                      onPost={PostId}
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-5 col-md-5 ">
                <div class="form-group">
                  <label class="mb-0">Nhân viên<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                  <div class="input-group">
                    <SelectOfficerList
                      PostId={PostId}
                      onSelected={e => setofficerId(e.value)}
                      items={officerId}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-12">
                <div className="row justify-content-center">
                  {images.length > 0 && images.map((item, index) => {
                    return (
                      <div className="col-3 col-md-3 py-3 px-5" key={index}>
                        <div className="box-image-camera">
                          <img src={item} alt="people" className='box-setting_img' />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="col-12 col-md-12 d-flex justify-content-center mt-2 text-note_authen">
               <span className='text-danger mr-2'>Lưu ý: </span>Các hình ảnh xác thực trên phải rõ khuôn mặt, nếu không hợp lệ vui lòng  
               <strong className='text-danger ml-2 font-weight-bold'>xác thực lại!</strong>
               </div>
              <div className="col-12 col-md-12 d-flex justify-content-center mt-4">
                <div class='d-flex justify-content-center'>
                  <div class=''>
                    <button
                      className="btn btn-lg btn-success mr-5 px-4"
                      onClick={e => {
                        // AlertInfo('Thông báo', 'Vui lòng cởi bỏ khẩu trang, di chuyển khuôn mặt vào giữa camera.')
                        setClassInfor('animate__animated animate__bounce  animate__bounceInRight')
                        CPN_spOfficerDesciptor_Save()
                      }}
                    >
                      <SaveAdd
                        color="#fff"
                        class="mr-2"
                      />
                      Lưu khuôn mặt
                    </button>
                  </div>
                  <div >
                    <button
                      className="btn btn-lg btn-danger px-4 "
                      onClick={e => {
                        // AlertInfo('Thông báo', 'Vui lòng cởi bỏ khẩu trang, di chuyển khuôn mặt vào giữa camera.')
                        setClassInfor('animate__animated animate__bounce  animate__bounceInRight')
                        resetGetFace()
                      }}
                    >
                      <BackSquare
                        color="#fff"
                        class="mr-2"
                      />
                      Xác thực lại
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceAuthentication;
