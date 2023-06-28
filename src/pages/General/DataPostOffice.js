import React, { useEffect, useRef, useState } from 'react';
import { ToastErrorRight, ToastSuccessRight, ToastWarningRight,
        DataTable, AlertSuccess, AlertError, AlertWarning, AlertDelete, SelectLocation, FormatDate } from '../../common';
import {  Save2, Magicpen, CloseCircle, Edit2 } from 'iconsax-react';
import { withRouter } from 'react-router-dom';
import { callApi } from "../../services";

const DataPostOffice = ()=>{

    useEffect(() => {
        CPN_spPostOffice_List()
    }, []);

    const [PostOfficeID,setPostOfficeID] = useState(0)
    const [POCode,setPOCode] = useState("")
    const [POName,setPOName] = useState("")
    const [POPhone,setPOPhone] = useState("")
    const [POEmail,setPOEmail] = useState("")
    const [POAddress,setPOAddress] = useState("")
    const [LocationId,setLocationId] = useState(0)
    const [LocationName,setLocationName] = useState("")
    const [DataTableList,setDataTableList] = useState([])
    const [HiddenTable,setHiddenTable] = useState(true)

    const onSelectLocation = (e)=>{
        setLocationId(e.value);
        setLocationName(e.label);
    }

    const CPN_spPostOffice_Save = async ()=>{
        try{
            if (POCode === '') {
                ToastWarningRight('Vui lòng nhập mã bưu cục!')
                return;
            }

            if (POName === '') {
                ToastWarningRight('Vui lòng nhập tên bưu vực!')
                return;
            }

            if (LocationId === 0) {
                ToastWarningRight('Vui lòng chọn khu vực!')
                return;
            }

            if (POAddress === 0) {
                ToastWarningRight('Vui lòng nhập địa chỉ!')
                return;
            }
    
            let pr = {
                PostOfficeID: PostOfficeID,
                POName: POName,
                POCode: POCode,
                POPhone: POPhone,
                POEmail: POEmail,
                POAddress: POAddress,
                LocationId: LocationId,
                LocationName: LocationName,
                Creater: 0,
                CreateName: "",
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spPostOffice_Save",
                API_key: "netcoApikey2025"
            }

            const list = await callApi.Main(params);
            if(list?.Status === "OK"){
                AlertSuccess(list.Message);
                CPN_spPostOffice_List();
                ClearFrom();
            }else{
                AlertWarning(list.Message);
            }
            
        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

    const CPN_spPostOffice_List = async ()=>{
        try {
            const params = {
                Json: JSON.stringify({OfficeID:0}),
                func: "CPN_spPostOffice_List",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if(res?.length > 0){
                setDataTableList(res)
                setHiddenTable(false)
            }
        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

    const ClearFrom = ()=>{
        setPostOfficeID(0);
        setPOName("");
        setPOCode("");
        setPOPhone("");
        setPOEmail("");
        setPOAddress("");
        setLocationId(0);
        setLocationName("");
    }

    const Edit = (item)=>{
        let Ojb = item.original;
        document.querySelector("#home-tab").click();
        setPostOfficeID(Ojb.PostOfficeID);
        setPOName(Ojb.POName);
        setPOCode(Ojb.POCode);
        setPOPhone(Ojb.POPhone);
        setPOEmail(Ojb.POEmail);
        setPOAddress(Ojb.POAddress);
        setLocationId(Ojb.LocationId);
        setLocationName(Ojb.LocationName);
    }

    const CPN_spPostOffice_Delete = async (e)=>{
        
        try {
            let pr = {
                OfficeID : 0,
                PostOfficeID: e.original.PostOfficeID,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spPostOffice_Delete",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if(res?.Status === "OK"){
                AlertSuccess(res.Message);
                const newArr = [...DataTableList];
                setDataTableList(newArr.filter(item => item.PostOfficeID !== e.original.PostOfficeID))
                return;
            }
        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 50,
            textAlign: "center",
            filterable: false,
            sortable: false,
          },
        {
            Header: 'Option',
            filterable: false,
            fixed: "left",
            accessor: '[row identifier to be passed to button]',
            width: 250,
            Cell: (item) =>
                <span >

                    <button class='btn btn-sm btn-success btn-xs '
                        style={{ color: 'white' }}
                        id='edbtn'
                        title='edit thực thể'
                        data-toggle="modal"
                        data-target="#editrandom"
                        onClick={() => Edit(item)} >
                        <Edit2 size="15" color="white" style={{ marginRight: '5px' }}

                        />
                        Edit
                    </button>

                    <button class='btn btn-sm btn-danger btn-xs btn-edit'
                        title='Xóa'
                        onClick={() => AlertDelete(
                            'Bạn có muốn xóa không?',
                            'Không thể hoàn tác sau khi xóa',
                            'Xóa',
                            'Hủy bỏ',
                            () => CPN_spPostOffice_Delete(item))}
                    >
                        <CloseCircle size="15" color="white" /> Delete
                    </button>

                </span>
        },
        {
            Header: 'Khu Vực',
            accessor: "LocationName",
            width: 250
        },
        {
            Header: 'Tên Bưu Cục',
            accessor: "POName",
            width: 250
        },
        {
            Header: 'Mã Bưu Cục',
            accessor: "POCode",
            width: 200
        },
        {
            Header: 'Số Điện Thoại',
            accessor: "POPhone",
            width: 200
        },
        {
            Header: 'Email',
            accessor: "POEmail",
            width: 250
        },
        {
            Header: 'Địa Chỉ',
            accessor: "POAddress",
            width: 300
        },
        {
            Header: 'Người Tạo',
            accessor: "CreateName",
            width: 250
        },
        {
            Header: 'Thời Gian Tạo',
            accessor: "CreateTime",
            width: 250,
            Cell: ({ row }) => (<span>{FormatDate(row._original.CreateTime,3)}</span>),
        },
        {
            Header: 'Người Sửa',
            accessor: "EditName",
            width: 250
        },
        {
            Header: 'Thời Gian Sửa',
            accessor: "EditTime",
            width: 250,
            Cell: ({ row }) => (<span>{row._original.EditTime === undefined?"": FormatDate(row._original.EditTime,3)}</span>),
        },
    ];

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
                        >
                            Thêm Mới
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

                        >
                            Danh Sách
                        </a>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div class="card  m-2">
                            <div class="card-header bg-transparent p-0 ">
                                <div class="row h-100 d-flex align-items-center">
                                    <div class="col-9 col-md-8 d-flex align-items-center " >
                                        <h3 class="card-title m-0 pl-2 font-weight-bold">Thêm Mới Bưu Cục</h3>
                                    </div>
                                    <div class="col-sm-12 col-md-4">
                                        <button 
                                            class='btn btn-sm btn-success float-right mr-2 px-2'
                                            type='button' id='addbtn' style={{ color: 'white' }} title='Lưu'
                                            data-toggle="modal"
                                            data-target="#addquest"
                                            onClick={CPN_spPostOffice_Save}
                                        >
                                            <Save2 size="18" className='mr-1' />
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-2">
                                <div className="row  mt-2">
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Mã Bưu Cục<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={POCode} onChange={e => setPOCode(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Tên Bưu Cục<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={POName} onChange={e => setPOName(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Số Điện Thoại</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={POPhone} onChange={e => setPOPhone(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Khu Vực<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <div class="input-group">
                                                <SelectLocation className="SelectMeno"
                                                    onSelected={e => {
                                                        onSelectLocation(e)
                                                    }}
                                                    LocationId ={LocationId}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6">
                                        <div class="form-group">
                                            <label class="label">Email</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={POEmail} onChange={e => setPOEmail(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6">
                                        <div class="form-group">
                                            <label class="label">Địa Chỉ<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={POAddress} onChange={e => setPOAddress(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab" >
                        <div class="card  m-2">
                            <div class="card-header bg-transparent p-0 ">
                                <div class="row h-100 d-flex align-items-center">
                                    <div class="col-9 col-md-8 d-flex align-items-center " >
                                        <h3 class='margin-bot-5 text-cd'>Danh Sách</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-2">
                                <div class={!HiddenTable ? "table-responsive" : "d-none"}>
                                    <div className="table-responsive text-center">
                                        <DataTable
                                            data={DataTableList}
                                            columns={columns}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(DataPostOffice);