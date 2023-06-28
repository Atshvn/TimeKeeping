import { Eye, Save2, UserRemove } from 'iconsax-react';
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { getFullFaceDescription, loadModels } from '../api/face';
import { ToastSuccess, ToastWarning, ToastWarningRight, SelectOfficerList, SelectPost, Loading, ToastError, ToastErrorRight } from '../common';
import { useOfficers } from '../hooks';
import { callApi, IMAGES_DOMAIN } from '../services';
import { setOfficers } from '../store';

const inputSize = 512;

const ImagesAuthentication = (props) => {
    const [states, dispatch] = useOfficers()

    const [PostId, setPostId] = useState(0);
    const [OfficerId, setOfficerId] = useState(0);
    const [dataImages, setDataImages] = useState([]);
    const [Files, setFiles] = useState([]);
    const [fullDescs, setFullDescs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        loadModels();
    }, []);


    const CPN_spTimeKeeping_ImagesOfFace_List = async () => {
        setDataImages([])
        if (PostId === 0 || PostId === -1) {
            ToastWarningRight("Vui lòng chọn bưu cục")
            return;
        }

        try {
            const params = {
                Json: JSON.stringify({
                    PostId: PostId,
                    OfficerId: OfficerId,
                }),
                func: "CPN_spTimeKeeping_ImagesOfFace_List",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if (res.length === 0 || !res.length) {
                ToastWarning("Không có dữ liệu")
                return;
            }
            setDataImages(res)

        } catch (error) {
            console.log(error);
        }
    }


    const CPN_spTimeKeeping_User_Delete = async (item) => {

        try {
            const params = {
                Json: JSON.stringify({
                    OfficerId: item.OfficerID
                }),
                func: "CPN_spTimeKeeping_User_Delete",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
           
            if (res.Status === 'OK') {
                ToastSuccess("Xóa thành công")
                CPN_spTimeKeeping_ImagesOfFace_List()
                return
                    ;
            }
            ToastWarning("Đã xảy ra lỗi!")


        } catch (error) {
            console.log(error);
        }
    }

    const handleUpload = async (e) => {
        
        setFullDescs([])
        setFiles([])
        let arrFiles = [], arrFullDesc = [], isCorrect = true;
        const files = e.target.files;

        if(files.length < 3 || files.length > 3) {
            ToastWarning("Vui lòng chọn đúng 3 hình của người cần được xác thực.")
            return
        }
        setIsLoading(true)

        for (let i = 0; i < files.length; i++) {
            arrFiles.push(files[i])
        }
        
        for (const file of arrFiles) {
            let des = await getFullFaceDescription(
                URL.createObjectURL(file),
                inputSize
            )
            if (des.length > 1) {
                let obj = { message: 'Hình ảnh không hợp lệ, có nhiều hơn một người trong hình.' }
                arrFullDesc.push(obj)
                isCorrect = false
            }
            if (des.length === 0) {
                let obj = { message: 'Hình ảnh không hợp lệ, không có người trong hình hoặc chất lượng hình không tốt.' }
                arrFullDesc.push(obj)
                isCorrect = false
            }
            if (des.length === 1) {
                arrFullDesc.push(des[0].descriptor)
            }
        }

        if(!isCorrect) {
            ToastError("Có hình ảnh không hợp lệ, vui lòng chọn ảnh khác.")
        }
        setIsValid(isCorrect)
        setFullDescs(arrFullDesc)
        setFiles(arrFiles)
        setIsLoading(false)

    }


    
  const uploadImageAuth = async () => {
    try {
      const formData = new FormData();

      for (let i = 0; i < Files.length; i++) {
        formData.append(`file${i}`, Files[i]);
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
    if (OfficerId === 0) {
      ToastWarningRight('Vui lòng chọn nhân viên');
      return;
    }
    if (!isValid) {
        ToastWarningRight('Hình ảnh chưa hợp lệ, vui lòng chọn lại');
        return;
      }

    setIsLoading(true)
    try {

      let imagesOfFace = await uploadImageAuth();
      const params = {
        Json: JSON.stringify({
          Id: 0,
          OfficerId: OfficerId,
          Descriptor: '' + fullDescs,
          ImagesOfFace: imagesOfFace
        }),
        func: "CPN_spOfficerDesciptor_Save",
        API_key: "netcoApikey2025"
      }
    
      const res = await callApi.Main(params);
      await CPN_spOfficerWithDescriptor_List()
      ToastSuccess(`${res.ReturnMess}`);
        await cancerAndClear()
        setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      ToastErrorRight('Có lỗi xảy ra, vui lòng thử lại sau')
    }
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
      const filterRes = res.filter(item => item.DescriptorOfFace.length > 0 && item.OfficerID === OfficerId);
      dispatch(setOfficers(filterRes))

    } catch (error) {
      console.log(error);
    }

  }


  const cancerAndClear = () => {
    setFullDescs([])
    setFiles([])
    setOfficerId(0)
    setPostId(0)
    setIsValid(false)
  }


    return (
        <div className='content'>
            <div className='m-3 tab-tab'>
                <ul class="nav nav-tabs tab-head bg-success " id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active"
                            id="home-tab"
                            data-toggle="tab"
                            href="#home"
                            role="tab"
                            aria-controls="home"
                            aria-selected="true"
                            onClick={cancerAndClear}
                            >
                            Xác thực khuôn mặt
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                            id="profile-tab"
                            data-toggle="tab"
                            href="#profile"
                            role="tab"
                            aria-controls="profile"
                            aria-selected="false"
                            onClick={cancerAndClear}
                        >
                            Hình ảnh xác thực
                        </a>
                    </li>

                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div class="card  m-2" >
                            <div class="card-header bg-transparent p-0 ">
                                <div class="row h-100 d-flex align-items-center">
                                    <div class="col-9 col-md-8 d-flex align-items-center " >
                                        <h3 class="card-title m-0 pl-2 font-weight-bold">UPLOAD HÌNH ẢNH XÁC THỰC</h3>

                                    </div>
                                    <div class="col-3 col-md-4">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-success float-right mr-2 px-2"
                                            disabled={!isValid}
                                            onClick={CPN_spOfficerDesciptor_Save}
                                        >
                                            <Save2 size="18" className='mr-1' />
                                            Lưu
                                        </button>

                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-2">
                                <div className="row  mt-2">
                                    <div class="col-sm-12 col-md-6 ">
                                        <div class="form-group">
                                            <label class="label">Bưu cục<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <div class="input-group">
                                                <SelectPost
                                                    AreaId={0}
                                                    onSelected={e => setPostId(e.value)}
                                                    onPost={PostId}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div class="form-group">
                                            <label class="">Nhân viên<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <div class="input-group">
                                                <SelectOfficerList
                                                    PostId={PostId}
                                                    onSelected={e => setOfficerId(e.value)}
                                                    items={OfficerId}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6 m-auto ">
                                        <label class="label">
                                            Upload hình ảnh <span className='text-danger'> (bắt buộc 3 hình)</span>
                                            <sup style={{ color: '#dc3545' }}>(*)</sup>
                                        </label>
                                        <input
                                            class="form-control-file"
                                            type="file"
                                            id="formFile"
                                            accept="image/*"
                                            multiple
                                            onChange={e => handleUpload(e)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-12 m-auto pt-4">
                                        <div className="row justify-content-center">
                                            {Files.length > 0 && Files.map((item, index) => {
                                                let src = URL.createObjectURL(item)
                                                return (
                                                        <div className="col-12 col-md-3 py-3 px-5" key={index}>
                                                            <div className="box-image-camera box-image">
                                                                <img
                                                                    src={src}
                                                                    alt="people"
                                                                    className={
                                                                        !fullDescs[index]?.length
                                                                            ? "box-setting_img shadow-danger"
                                                                            : "box-setting_img shadow-success"
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="box-image_description">
                                                                {
                                                                    !fullDescs[index]?.length
                                                                        ? <div className='font-weight-bold text-center p-4 text-danger'>
                                                                            {fullDescs[index]?.message}
                                                                        </div>
                                                                        : ''
                                                                }
                                                            </div>
                                                        </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <div class="card  m-2" >
                            <div class="card-header bg-transparent p-0 ">
                                <div class="row h-100 d-flex align-items-center">
                                    <div class="col-9 col-md-6 d-flex align-items-center " >
                                        <h3 class="card-title m-0 pl-2 font-weight-bold">Xem hình ảnh xác thực ({dataImages.length})</h3>

                                    </div>
                                    <div class="col-3 col-md-6">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-success float-right mr-3 px-3"
                                            onClick={CPN_spTimeKeeping_ImagesOfFace_List}
                                        >
                                            <Eye size="18" className='mr-1 d-none d-sm-none d-md-inline-block' />
                                            xem
                                        </button>

                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-2">
                                <div className="row  mt-2">
                                    <div class="col-sm-12 col-md-6 ">
                                        <div class="form-group">
                                            <label class="label">Bưu cục<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <div class="input-group">
                                                <SelectPost
                                                    AreaId={0}
                                                    onSelected={e => setPostId(e.value)}
                                                    onPost={PostId}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div class="form-group">
                                            <label class="">Nhân viên</label>
                                            <div class="input-group">
                                                <SelectOfficerList
                                                    PostId={PostId}
                                                    onSelected={e => setOfficerId(e.value)}
                                                    items={OfficerId}
                                                    title={'Chọn tất cả'}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 row mt-2">
                                        {
                                            dataImages.length > 0 && dataImages.map((item, index) => {
                                                let splitImages = item.ImagesOfFace.split(';')

                                                return (
                                                    <div class="col-md-6" key={index}>
                                                        <div className=" card my-4">
                                                            <div className="card-body row p-2">
                                                                <div className="col-12 col-md-12 ">
                                                                    <div className="row ">
                                                                        {splitImages.map((img, i) => {
                                                                            return (
                                                                                <div className="col-4 col-md-4" key={img}>
                                                                                    <img
                                                                                        src={`${IMAGES_DOMAIN}${img}`}
                                                                                        alt=""
                                                                                        className='box-setting_img'
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                <div className='col-12'>
                                                                    <div class="card-content d-flex flex-row text-center">
                                                                        <div class="card-top pb-2">
                                                                            <h3 class="card-title">{item.OfficerName}</h3>
                                                                            <i class="card-user-name text-muted">{item.DepartmentName} </i>
                                                                        </div>
                                                                        <div class="card-top pb-2">
                                                                            <button
                                                                                class="btn btn-sm btn-outline-danger py-2"
                                                                                onClick={() => CPN_spTimeKeeping_User_Delete(item)}
                                                                            >
                                                                                <UserRemove size="14" />
                                                                                <span className='pl-2'>Xóa nhân viên</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && <Loading title = 'Đang xử lý hình ảnh, vui lòng chờ trong giây lát!'/>}
        </div>
    )

}

export default withRouter(ImagesAuthentication);

