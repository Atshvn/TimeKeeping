import React, { useEffect, useRef, useState } from 'react';
import { ToastErrorRight, ToastSuccessRight, ToastWarningRight,
        DataTable, AlertSuccess, AlertError, AlertWarning, AlertDelete } from '../../common';
import {  Save2, Edit2, CloseCircle } from 'iconsax-react';
import { withRouter } from 'react-router-dom';
import { callApi } from "../../services";
const DataLocation = (props)=>{

    useEffect(() => {
        CPN_spLocation_Area_List()
    }, []);

    const [LocationId,setLocationId] = useState(0)
    const [CodeLocation,setCodeLocation] = useState("")
    const [NameLocation,setNameLocation] = useState("")
    const [CenterId,setCenterId] = useState(0)
    const [GroupId,setGroupId] = useState(0)
    const [Notes,setNotes] = useState("")
    const [DataTableList,setDataTableList] = useState([])
    const [HiddenTable,setHiddenTable] = useState(true)

    const CPN_spLocation_Area_Save = async ()=>{

        try{
            if (CodeLocation === '') {
                ToastWarningRight('Vui lòng nhập mã khu vực!')
                return;
            }

            if (NameLocation === '') {
                ToastWarningRight('Vui lòng nhập tên khu vực!')
                return;
            }
    
            let pr = {
                LocationId: LocationId,
                Code: CodeLocation,
                Name: NameLocation,
                CenterId: CenterId,
                GroupId: GroupId,
                Notes: Notes,
    
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spLocation_Area_Save",
                API_key: "netcoApikey2025"
            }

            const list = await callApi.Main(params);
            if(list?.Status === "OK"){
                AlertSuccess(list.Message);
                CPN_spLocation_Area_List();
                ClearFrom();
            }else{
                AlertWarning(list.Message);
            }
            
        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

    const CPN_spLocation_Area_List = async ()=>{
        try {
            const params = {
                Json: JSON.stringify({OfficeID:0}),
                func: "CPN_spLocation_Area_List",
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
        setLocationId(Ojb.ID);
        setCodeLocation(Ojb.Code);
        setNameLocation(Ojb.Name);
        setGroupId(Ojb.GroupId);
        setNotes(Ojb.Notes);
    }

    const CPN_spLocation_Area_Delete = async (e)=>{
        
        try {
            let pr = {
                OfficeID : 0,
                LocationID: e.original.ID,
            }

            const params = {
                Json: JSON.stringify(pr),
                func: "CPN_spLocation_Area_Delete",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if(res?.Status === "OK"){
                AlertSuccess(res.Message);
                const newArr = [...DataTableList];
                setDataTableList(newArr.filter(item => item.ID !== e.original.ID))
                return;
            }
        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

    const ClearFrom = ()=>{
        setLocationId(0);
        setCodeLocation("");
        setNameLocation("");
        setGroupId(0);
        setNotes("");
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
                            () => CPN_spLocation_Area_Delete(item))}
                    >
                        <CloseCircle size="15" color="white" /> Delete
                    </button>

                </span>
        },
        {
            Header: 'Mã Khu Vực',
            accessor: "Code",
            width: 200
        },
        {
            Header: 'Tên Khu Vực',
            accessor: "Name",
            width: 250
        },
        {
            Header: 'Thuộc Nhóm',
            accessor: "GroupId",
            width: 150
        },
        {
            Header: 'Ghi Chú',
            accessor: "Notes",
            width: 350
        },
    ];

    return (
        <div className="content">
            <div className="card  m-3 ">
                <div class="card-header bg-transparent p-0 ">
                    <div class="row h-100 d-flex align-items-center">
                        <div class="col-8 col-md-6" >
                            <h3 class="col-9 col-md-8 d-flex align-items-center ">
                                Quản Lý Khu Vực
                            </h3>
                        </div>
                        <div class="col-4 col-md-6">
                            <button
                                type="button"
                                class="btn btn-sm btn-success float-right mr-2 px-2"
                                onClick={CPN_spLocation_Area_Save}
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
                                <label class="label">Mã Khu Vực<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={CodeLocation} onChange={e => setCodeLocation(e.target.value)}
                                    style={{backgroundColor:"#E0EEE0"}}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label class="label">Tên Khu Vực<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={NameLocation} onChange={e => setNameLocation(e.target.value)}
                                    style={{backgroundColor:"#E0EEE0"}}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label class="label">Thuộc Nhóm</label>
                                <input
                                    type="number"
                                    class="form-control"
                                    value={GroupId} onChange={e => setGroupId(e.target.value)}
                                    style={{backgroundColor:"#E0EEE0"}}
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                            <div class="form-group">
                                <label class="label">Ghi Chú</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={Notes} onChange={e => setNotes(e.target.value)}
                                    style={{backgroundColor:"#E0EEE0"}}
                                />
                            </div>
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
    )
}

export default withRouter(DataLocation);