import React, { useEffect, useRef, useState } from 'react';
import { ToastErrorRight, ToastSuccessRight, ToastWarningRight,
        DataTable, AlertSuccess, AlertError, AlertWarning, AlertDelete
        , FormatDate, SelectPostOfficer } from '../../common';
import {  Save2, Magicpen, CloseCircle, Edit2 } from 'iconsax-react';
import { withRouter } from 'react-router-dom';
import { callApi } from "../../services";

const DataDeparment = ()=>{

    useEffect(() => {
        CPN_spDeparment_List(0)
    }, []);

    const [DeparmentID,setDeparmentID] = useState(0)
    const [DeparmentCode,setDeparmentCode] = useState("")
    const [DeparmentName,setDeparmentName] = useState("")
    const [DPDescription,setDPDescription] = useState("")
    const [Permition,setPermition]  = useState("")
    const [PostOfficeID,setPostOfficeID] = useState(0)
    const [DataTableList,setDataTableList] = useState([])
    const [HiddenTable,setHiddenTable] = useState(true)

    const CPN_spDeparment_Save = async () => {
        try{
            if (DeparmentCode === '') {
                ToastWarningRight('Vui lòng nhập mã phòng!')
                return;
            }

            if (DeparmentName === '') {
                ToastWarningRight('Vui lòng nhập tên phòng!')
                return;
            }

            if (PostOfficeID === 0) {
                ToastWarningRight('Vui lòng chọn bưu cục!')
                return;
            }
    
            let pr = {
                DeparmentID: DeparmentID,
                DeparmentCode: DeparmentCode,
                DeparmentName: DeparmentName,
                DeparmentDescription: DPDescription,
                Permition: Permition,
                PostOfficeID: PostOfficeID,
                Types: 1,
                Creater: 0,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spDeparment_Save",
                API_key: "netcoApikey2025"
            }

            const list = await callApi.Main(params);
            if(list?.Status === "OK"){
                AlertSuccess(list.Message);
                CPN_spDeparment_List(0);
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
        setDeparmentID(0);
        setDeparmentName("");
        setDeparmentCode("");
        setDPDescription("");
        setPermition("");
        setPostOfficeID("");
    }

    /*----- Danh sách -------*/

    const [PostIDList,setPostIDList] = useState(0)

    const CPN_spDeparment_List = async (e) => {
        try {
            let pr = {
                PostOfficeID : e === 0 ? 0 : PostIDList,
            }
            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spDeparment_List",
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
        setDeparmentID(Ojb.DeparmentID);
        setDeparmentName(Ojb.DeparmentName);
        setDeparmentCode(Ojb.DeparmentCode);
        setDPDescription(Ojb.DeparmentDescription);
        setPermition(Ojb.Permition);
        setPostOfficeID(Ojb.PostOfficeID);
    }

    const CPN_spDeparment_Delete = async (e)=>{
        
        try {
            let pr = {
                OfficeID : 0,
                DeparmentID: e.original.DeparmentID,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spDeparment_Delete",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if(res?.Status === "OK"){
                AlertSuccess(res.Message);
                const newArr = [...DataTableList];
                setDataTableList(newArr.filter(item => item.DeparmentID !== e.original.DeparmentID))
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
                            () => CPN_spDeparment_Delete(item))}
                    >
                        <CloseCircle size="15" color="white" /> Delete
                    </button>

                </span>
        },
        {
            Header: 'Bưu Cục',
            accessor: "POName",
            width: 250
        },
        {
            Header: 'Tên Phòng',
            accessor: "DeparmentName",
            width: 250
        },
        {
            Header: 'Mã Phòng',
            accessor: "DeparmentCode",
            width: 200
        },
        {
            Header: 'Chức Năng Phòng',
            accessor: "DeparmentDescription",
            width: 300
        },
        {
            Header: 'Chứng Nhận',
            accessor: "Permition",
            width: 250
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
                                        <h3 class="card-title m-0 pl-2 font-weight-bold">Thêm Mới Phòng Ban</h3>
                                    </div>
                                    <div class="col-sm-12 col-md-4">
                                        <button 
                                            class='btn btn-sm btn-success float-right mr-2 px-2'
                                            type='button' id='addbtn' title='Lưu'
                                            data-toggle="modal"
                                            data-target="#addquest"
                                            onClick={CPN_spDeparment_Save}
                                        >
                                            <Save2 size="18" className='mr-1' />
                                            Lưu
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-2">
                                <div className="row  mt-2">
                                    <div className="col-xs-12 col-sm-6 col-md-4">
                                        <div class="form-group">
                                            <label class="label">Mã Phòng Ban<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={DeparmentCode} onChange={e => setDeparmentCode(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-4">
                                        <div class="form-group">
                                            <label class="label">Tên Phòng Ban<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={DeparmentName} onChange={e => setDeparmentName(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-4">
                                        <div class="form-group">
                                            <label class="label">Bưu Cục<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                            <div class="input-group">
                                                <SelectPostOfficer className="SelectMeno"
                                                    onSelected={e => {
                                                        setPostOfficeID(e.value)
                                                    }}
                                                    PostID = {PostOfficeID}
                                                    LocationId ={0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6">
                                        <div class="form-group">
                                            <label class="label">Miêu Tả Chức Năng</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={DPDescription} onChange={e => setDPDescription(e.target.value)}
                                                style={{backgroundColor:"#E0EEE0"}}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-6 col-md-6">
                                        <div class="form-group">
                                            <label class="label">Chứng nhận</label>
                                            <input
                                                type="text"
                                                class="form-control"
                                                value={Permition} onChange={e => setPermition(e.target.value)}
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
                                            class='btn btn-sm btn-success float-right mr-2 px-2'
                                            onClick={e => CPN_spDeparment_List(1)}
                                            
                                        >
                                            <Magicpen size="15" color="white" style={{ marginRight: '5px' }}/>
                                            Tìm kiếm
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body p-2">
                                <div class="row mt-3 mb-2">
                                    <div class="col-sm-12 col-md-12  ">
                                        <div class="form-group d-flex">
                                            <div class="input-group mr-3 w-50 m-auto ">
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

export default withRouter(DataDeparment);