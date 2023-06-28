import { ArrowRight, DocumentUpload, Eye, Play } from "iconsax-react";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  ToastErrorRight,
  ToastSuccess,
  ToastWarningRight,
  DataTable,
  SelectOfficerList,
  SelectPost,
} from "../common";
import { RunAudio } from "../hooks";
import { callApi } from "../services";

const UploadAudio = () => {
  const [files, setFiles] = useState([]);
  const [OfficerId, setOfficerId] = useState(0);
  const [PostId, setPostId] = useState(-1);
  const [dataTable, setdataTable] = useState([]);
  const [PostIdSearch, setPostIdSearch] = useState(-1);
  const [OfficerIdSearch, setOfficerIdSearch] = useState(0);
  const [url, setUrl] = useState("./audio/ok.mp3");
  const [show, setShow] = useState(false);

  const handleUpload = (e) => {
    const files = e.target.files;
    setFiles(files);
  };

  const submitUpload = async () => {
    if (files.length === 0) {
      ToastWarningRight("Vui lòng chọn file để upload");
      return;
    }
    if (PostId === 0 || PostId === -1) {
      ToastWarningRight("Vui lòng chọn nhân viên");
      return;
    }
    if (OfficerId === 0) {
      ToastWarningRight("Vui lòng chọn nhân viên");
      return;
    }
    try {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("OfficerId", OfficerId.id);
      data.append("Key", "Timekeeping");
      data.append("Code", OfficerId.name);
      const res = await callApi.UploadFile(data);
      const linkFile = res
        ?.replaceAll('"', "")
        .replaceAll("\\\\", "/")
        .replaceAll("[", "")
        .replaceAll("]", "")
        .replaceAll(",", ";");

      const pr = {
        Json: JSON.stringify({
          OfficerId: OfficerId.value,
          LinkAudio: linkFile,
        }),
        func: "CPN_spTimeKeeping_LinkAudio_Save",
        API_key: "netcoApikey2025",
      };

      const res2 = await callApi.Main(pr);

      if (res2.Status === "OK") {
        setFiles([]);
        setOfficerId({ value: 0, label: "Vui lòng chọn" });
        ToastSuccess("Upload thành công");
        return;
      }
    } catch (error) {
      console.log(error);
      ToastErrorRight("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const CPN_spTimeKeeping_Audio_List = async () => {
    if (PostIdSearch === -1 || PostIdSearch === 0) {
      ToastWarningRight("Vui lòng chọn bưu cục");
      return;
    }

    try {
      const params = {
        Json: JSON.stringify({
          PostId: PostIdSearch === -1 ? 0 : PostIdSearch,
          OfficerId: OfficerIdSearch,
        }),
        func: "CPN_spTimeKeeping_Audio_List",
        API_key: "netcoApikey2025",
      };
      const res = await callApi.Main(params);
      if (res.length > 0) {
        setdataTable(res);
      }
    } catch (error) {
      console.log(error);
      ToastErrorRight("Có lỗi xảy ra, liên hệ với IT");
    }
  };

  const handlePlayAudio = async (item) => {
    await setUrl(`https://mediaimages.vps.vn/${item.LinkAudio}`);
    await setShow(true);
  };

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
      Header: "Tùy chọn",
      minWidth: 100,
      filterable: false,
      sortable: false,
      accessor: "[row identifier to be passed to button]",
      Cell: ({ row }) => {
        return row._original.isLinkAudio === 1 ? (
          <span>
            <button
              className="btn btn-sm btn-info mr-2"
              onClick={(e) => clickRow({ row })}
            >
              <Play size="16" color="#fff" className="mr-1" />
              Phát Audio
            </button>
          </span>
        ) : (
          <></>
        );
      },
    },
    {
      Header: "Tên nhân viên",
      accessor: "OfficerName",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Mã nhân viên",
      accessor: "OfficerCode",
      minWidth: 200,
      textAlign: "center",
    },
    {
      Header: "Email",
      accessor: "Email",
      minWidth: 200,
      textAlign: "center",
    },
  ];
  const clickRow = (item) => {
    handlePlayAudio(item.row._original);
    setShow(false);
  };

  //#endregion

  return (
    <div className="content">
      <div class="card  m-3">
        <div class="card-header bg-transparent p-0 ">
          <div class="row h-100 d-flex align-items-center">
            <div class="col-sm-12 col-md-6 d-flex align-items-center ">
              <h3 class="card-title m-0 pl-2 font-weight-bold">Upload Audio</h3>
              <a
                type="button"
                class="btn btn-sm btn-outline-danger ml-4"
                href="https://voicemaker.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Website thu âm
                <ArrowRight size="18" className="ml-1" />
              </a>
            </div>
          </div>
        </div>
        <div class="card-body p-2">
          <div className="row  mt-2">
            <div className="col-md-4 ">
              <label class="label">
                File âm thanh<sup style={{ color: "#dc3545" }}>(*)</sup>
              </label>
              <input
                class="form-control-file"
                type="file"
                id="formFile"
                accept="audio/mp3"
                onChange={(e) => handleUpload(e)}
              />
            </div>

            <div class="col-sm-12 col-md-4 ">
              <div class="form-group">
                <label class="label">
                  Bưu cục<sup style={{ color: "#dc3545" }}>(*)</sup>
                </label>
                <div class="input-group">
                  <SelectPost
                    AreaId={0}
                    onSelected={(e) => setPostId(e.value)}
                    onPost={PostId}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div class="form-group">
                <label class="">
                  Nhân viên<sup style={{ color: "#dc3545" }}>(*)</sup>
                </label>
                <div class="input-group">
                  <SelectOfficerList
                    PostId={PostId}
                    onSelected={(e) => setOfficerId(e)}
                    items={OfficerId.value}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 mb-2  d-flex justify-content-center align-items-center">
            <button
              className="btn btn-success btn-lg  mt-3"
              onClick={submitUpload}
            >
              <DocumentUpload size="20" className="mr-2" />
              Upload
            </button>
          </div>
        </div>
      </div>

      <div class="card  m-3 mt-4">
        <div class="card-header bg-transparent p-0 ">
          <div class="row h-100 d-flex align-items-center">
            <div class="col-6 col-md-6">
              <h3 class="card-title m-0 pl-2 font-weight-bold">
                Danh sách ({dataTable.length})
              </h3>
            </div>
            <div class="col-6 col-md-6">
              <button
                type="button"
                class="btn btn-sm btn-danger float-right mr-3 px-3"
                onClick={CPN_spTimeKeeping_Audio_List}
              >
                <Eye size="18" className="mr-1" />
                xem
              </button>
            </div>
          </div>
        </div>
        <div class="card-body p-2">
          <div className="row  mt-2">
            <div class="col-sm-12 col-md-6 ">
              <div class="form-group">
                <label class="label">
                  Bưu cục<sup style={{ color: "#dc3545" }}>(*)</sup>
                </label>
                <div class="input-group">
                  <SelectPost
                    AreaId={0}
                    onSelected={(e) => setPostIdSearch(e.value)}
                    onPost={PostIdSearch}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div class="form-group">
                <label class="">Nhân viên</label>
                <div class="input-group">
                  <SelectOfficerList
                    PostId={0}
                    onSelected={(e) => setOfficerIdSearch(e.value)}
                    items={OfficerIdSearch}
                  />
                </div>
              </div>
            </div>
            {dataTable.length > 0 && (
              <div className="col-12 col-md-12 mt-4">
                <div class=" table-responsive">
                  <div className="table-responsive text-center">
                    <DataTable data={dataTable} columns={columns} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {show && <RunAudio url={url} click={show} />}
    </div>
  );
};

export default withRouter(UploadAudio);
