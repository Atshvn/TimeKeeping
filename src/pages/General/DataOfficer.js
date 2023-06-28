import React, { useEffect, useRef, useState } from 'react';
import { ToastErrorRight, ToastSuccessRight, ToastWarningRight,
        DataTable, AlertSuccess, AlertError, AlertWarning, AlertDelete
        , FormatDate, SelectPostOfficer, SelectDeparment } from '../../common';
import {  Save2, Magicpen, CloseCircle, Edit2 } from 'iconsax-react';
import { withRouter } from 'react-router-dom';
import DateTimePicker from "react-datetime-picker";
import { callApi } from "../../services";

const DataOfficer = () =>{

    useEffect(() => {
        CPN_spOfficerNew_List(0)
    }, []);

    const [OfficerID,setOfficerID] = useState(0)
    const [OfficerName,setOfficerName] = useState("")
    const [OfficerCode,setOfficerCode] = useState("")
    const [DeparmentID,setDeparmentID] = useState(-2)
    const [DepartmentName,setDepartmentName] = useState("")
    const [PostOfficeId,setPostOfficeId] = useState(-2)
    const [PostOfficeName,setPostOfficeName] = useState("")
    const [Phone,setPhone] = useState("")
    const [Email,setEmail] = useState("")
    const [Address,setAddress] = useState("")
    const [Birthday,setBirthday] = useState()
    const [DataTableList,setDataTableList] = useState([])
    const [HiddenTable,setHiddenTable] = useState(true)

    const onSelectPost = (e) =>{
        setPostOfficeId(e.value);
        setPostOfficeName(e.label);
    }

    const onSelectDepar = (e) =>{
        setDeparmentID(e.value);
        setDepartmentName(e.label);
    }

    const CPN_spOfficerNew_Save = async () =>{
        debugger
        try{
            if (OfficerCode === '') {
                ToastWarningRight('Vui lòng nhập mã nhân viên!')
                return;
            }

            if (OfficerName === '') {
                ToastWarningRight('Vui lòng nhập tên nhân viên!')
                return;
            }

            if (PostOfficeId === -2 || PostOfficeId === 0) {
                ToastWarningRight('Vui lòng chọn bưu cục!')
                return;
            }

            if (DeparmentID === -2 || DeparmentID === 0) {
                ToastWarningRight('Vui lòng chọn phàng ban!')
                return;
            }

            if (Birthday === undefined) {
                ToastWarningRight('Vui lòng chọn ngày sinh!')
                return;
            }
    
            let pr = {
                OfficerID: OfficerID,
                OfficerName: OfficerName,
                OfficerCode: OfficerCode,
                DeparmentID: DeparmentID,
                DepartmentName: DepartmentName,
                PostOfficeId: PostOfficeId,
                PostOfficeName: PostOfficeName,
                Phone: Phone,
                Email: Email,
                Address: Address,
                Birthday: FormatDate(Birthday,0),
                Creater: 0
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spOfficerNew_Save",
                API_key: "netcoApikey2025"
            }

            const list = await callApi.Main(params);
            if(list?.Status === "OK"){
                AlertSuccess(list.Message);
                CPN_spOfficerNew_List(0);
                ClearFrom();
            }else{
                AlertWarning(list.Message);
            }
            
        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

    const ClearFrom = ()=>{
        setOfficerID(0);
        setOfficerCode("");
        setOfficerName("");
        setDeparmentID(-2);
        setPostOfficeId(-2);
        setDepartmentName("");
        setPostOfficeName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setBirthday();
    }

    /*----- Danh sách -------*/

    const [PostIDList,setPostIDList] = useState(-2)
    const [DeparmentList,setDeparmentList] = useState(-2)

    const CPN_spOfficerNew_List = async (e) =>{
        try {
            let pr = {
                PostOfficeID : e === 0 ? 0 : PostIDList === -2 ? 0 : PostIDList,
                DeparmentID : e === 0 ? 0 : DeparmentList === -2 ? 0 : DeparmentList,
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spOfficerNew_List",
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

    const Edit = (item)=>{
        let Ojb = item.original;
        document.querySelector("#home-tab").click();
        setOfficerID(Ojb.OfficerID);
        setOfficerCode(Ojb.OfficerCode);
        setOfficerName(Ojb.OfficerName);
        setDeparmentID(Ojb.DeparmentID);
        setPostOfficeId(Ojb.PostOfficeId);
        setPhone(Ojb.Phone);
        setEmail(Ojb.Email);
        setAddress(Ojb.Address);
        setBirthday(Ojb.Birthday);
    }

    const CPN_spOfficer_Delete = async (e)=>{
        try {
            let pr = {
                Creater : 0,
                OfficerID: e.original.OfficerID,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spOfficer_Delete",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if(res?.Status === "OK"){
                AlertSuccess(res.Message);
                const newArr = [...DataTableList];
                setDataTableList(newArr.filter(item => item.OfficerID !== e.original.OfficerID))
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
                            () => CPN_spOfficer_Delete(item))}
                    >
                        <CloseCircle size="15" color="white" /> Delete
                    </button>

                </span>
        },
        {
            Header: 'Bưu Cục',
            accessor: "PostOfficeName",
            width: 250
        },
        {
            Header: 'Phòng Ban',
            accessor: "DepartmentName",
            width: 250
        },
        {
            Header: 'Tên Nhân Viên',
            accessor: "OfficerName",
            width: 200
        },
        {
            Header: 'Mã Nhân Viên',
            accessor: "OfficerCode",
            width: 200
        },
        {
            Header: 'Ngày Sinh',
            accessor: "Birthday",
            width: 200,
            Cell: ({ row }) => (<span>{FormatDate(row._original.Birthday,5)}</span>),
        },
        {
            Header: 'Số ĐT',
            accessor: "Phone",
            width: 200
        },
        {
            Header: 'Email',
            accessor: "Email",
            width: 250
        },
        {
            Header: 'Địa Chỉ',
            accessor: "Address",
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
                        <div div class="card  m-2">
                            <div class="card-header bg-transparent p-0 ">
                                <div class="row h-100 d-flex align-items-center">
                                    <div class="col-9 col-md-8 d-flex align-items-center ">
                                        <h3 class="card-title m-0 pl-2 font-weight-bold">Thêm Mới Nhân Viên</h3>
                                    </div>
                                    <div class="col-sm-12 col-md-4">
                                        <button 
                                            class='btn btn-sm btn-success float-right mr-2 px-2'
                                            type='button' id='addbtn' style={{ color: 'white' }} title='Lưu'
                                            data-toggle="modal"
                                            data-target="#addquest"
                                            onClick={CPN_spOfficerNew_Save}
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
                                            <label class="label">Mã Nhân Viên<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={OfficerCode} onChange={e => setOfficerCode(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Tên Nhân Viên<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={OfficerName} onChange={e => setOfficerName(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Bưu Cục<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <div class="input-group">
                                                <SelectPostOfficer className="SelectMeno"
                                                    onSelected={e => {
                                                        onSelectPost(e)
                                                    }}
                                                    PostID = {PostOfficeId}
                                                    LocationId ={0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Phòng Ban<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <div class="input-group">
                                                <SelectDeparment className="SelectMeno"
                                                    onSelected={e => {
                                                        onSelectDepar(e)
                                                    }}
                                                    PostID = {PostOfficeId}
                                                    DeparmentID ={DeparmentID}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Ngày Sinh</label>
                                            <DateTimePicker
                                                className="form-control2 z-date"
                                                value={Birthday}
                                                onChange={(date) => setBirthday(date)}
                                                format={"dd/MM/yyyy"}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Số Điện Thoại</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={Phone} onChange={e => setPhone(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Email</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={Email} onChange={e => setEmail(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-3">
                                        <div class="form-group">
                                            <label class="label">Địa Chỉ</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={Address} onChange={e => setAddress(e.target.value)}
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
                                        <h3 class="card-title m-0 pl-2 font-weight-bold">Danh Sách</h3>
                                    </div>
                                    <div class="col-sm-12 col-md-4">
                                        <button
                                            type='button'
                                            className="btn btn-sm btn-success float-right mr-2 px-2"
                                            onClick={e => CPN_spOfficerNew_List(1)}
                                            
                                        >
                                            <Magicpen size="15" color="white" style={{ marginRight: '5px' }}/>
                                            Tìm kiếm
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-2">
                                <div class="row mt-3 mb-2">
                                    <div class="col-sm-12 col-md-6 m-auto">
                                        <div class="form-group">
                                            <label class="label">Bưu Cục</label>
                                            <div class="input-group">
                                                <SelectPostOfficer
                                                    onSelected={e => {
                                                        setPostIDList(e.value)
                                                    }}
                                                    PostID = {PostIDList}
                                                    LocationId ={0}
                                                />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-6 m-auto">
                                        <div class="form-group">
                                            <label class="label">Phòng Ban</label>
                                            <div class="input-group">
                                                <SelectDeparment
                                                    onSelected={e => {
                                                        setDeparmentList(e.value)
                                                    }}
                                                    DeparmentID = {DeparmentList}
                                                    PostID = {PostIDList}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

export default withRouter(DataOfficer);