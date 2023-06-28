import {  CloudRemove, UserRemove } from "iconsax-react";
import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { ToastErrorRight, ToastSuccessRight, ToastWarningRight, DataTable, SelectPost } from "../common";
import { useOfficers } from "../hooks";
import { callApi } from "../services";


const ManagerAccounts = () => {
    const [state, dispatch] = useOfficers()
    const [PostList, setPostList] = useState([]);
    const [PostId, setPostId] = useState(0);

    useEffect(() => {
        CPN_spTimeKeeping_Login_List()
    }, []);

    //Danh sach tai khoan
    const CPN_spTimeKeeping_Login_List = async () => {
        try {
            const params = {
                Json: JSON.stringify({

                }),
                func: "CPN_spTimeKeeping_Login_List",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            res?.length && setPostList(res)

        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

      // kich hoat tai  khoan 
      const CPN_spTimeKeeping_Account_Add = async () => {
          if(PostId === 0) {
                ToastWarningRight("Vui lòng chọn bưu cục")
                return;
          }
        try {
            const params = {
                Json: JSON.stringify({
                    PostId: PostId
                }),
                func: "CPN_spTimeKeeping_Account_Add",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if(res.Status === "OK") {
                ToastSuccessRight("Kích hoạt thành công")
                CPN_spTimeKeeping_Login_List()
                return;
            }
            ToastErrorRight(res?.ReturnMess)

        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

     //xoa token tai khoan
     const CPN_spTimeKeeping_ResetToken = async (item) => {
       
      try {
          const params = {
              Json: JSON.stringify({
                  PostId: item,
                  Editer: state.role
              }),
              func: "CPN_spTimeKeeping_ResetToken",
              API_key: "netcoApikey2025"
          }
          const res = await callApi.Main(params);
          if(res.Status === "OK") {
              ToastSuccessRight("Reset thành công")
              CPN_spTimeKeeping_Login_List()
              return;
          }
          ToastErrorRight(res.ReturnMess)

      } catch (error) {
          console.log(error);
          ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
      }
  }

     // xoa tai khoan 
     const CPN_spTimeKeeping_Account_Delete = async (item) => {
       
        try {
            const params = {
                Json: JSON.stringify({
                    PostId: item
                }),
                func: "CPN_spTimeKeeping_Account_Delete",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if(res.Status === "OK") {
                ToastSuccessRight(res.ReturnMess)
                CPN_spTimeKeeping_Login_List()
                return;
            }
  
        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, liên hệ với IT')
        }
    }

    //#region Table
    const columns = [
        {
            Header: "STT",
            accessor: "[row identifier to be passed to button]",
            width: 50,
            Cell: (row) => <span>{row.index + 1}</span>,
            filterable: false,
            sortable: false,
        },
        {
            Header: 'Tùy chọn',
            width: 270,
            filterable: false,
            sortable: false,
            accessor: '[row identifier to be passed to button]',
            Cell: ({ row }) => (
                <span>
                    <button
                        className="btn btn-sm btn-info mr-2"
                        onClick={e => clickRow({ row })}
                    >
                        <UserRemove size="16" color="#fff" className="mr-1"/>
                        Xóa tài khoản
                    </button>
                    <button
                        className="btn btn-sm btn-warning"
                        onClick={e => clickReset({ row })}
                    >
                        <CloudRemove size={16} color="#000" className="mr-1"/>
                        Reset Token
                    </button>
                </span>
            )
        },
        {
            Header: 'Tên bưu cục',
            accessor: "POName",
            minWidth: 200,
            textAlign: 'center'
        },

    ];
    const clickRow = (item) => {
        CPN_spTimeKeeping_Account_Delete(item.row._original.PostOfficeId)
    }
    const clickReset = (item) => {
        CPN_spTimeKeeping_ResetToken(item.row._original.PostOfficeId);
    }
    //#endregion


    return (
        <div className="content">
            <div class="card  m-3" >
                <div class="card-header bg-transparent p-0 ">
                    <div class="row h-100 d-flex align-items-center">
                        <div class="col-sm-12 col-md-6" >
                            <h3 class="card-title m-0 pl-2 font-weight-bold">Quản lý tài khoản bưu cục ({PostList.length})</h3>
                        </div>
                      
                    </div>
                </div>
                <div class="card-body p-2">
                    <div class="row mt-3 mb-2">
                        <div class="col-sm-12 col-md-12  ">
                            <div class="form-group d-flex">
                                <div class="input-group mr-3 w-50 m-auto ">
                                    <SelectPost
                                        AreaId={0}
                                        onSelected={e => setPostId(e.value)}
                                        onPost={PostId}
                                        isNewStyle={true}
                                    />
                                </div>
                                
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-12 d-flex align-item-center">
                            <button
                                className="btn btn-success px-3 m-auto "
                                onClick={e => CPN_spTimeKeeping_Account_Add()}
                            >
                                Kích hoạt
                            </button>
                        </div>
                    </div>

                    <div class=" table-responsive">
                        <div className="table-responsive text-center">
                            <DataTable
                                data={PostList}
                                columns={columns}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default withRouter(ManagerAccounts)