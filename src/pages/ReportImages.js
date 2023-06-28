import {  ArrowUp2, Eye, UserRemove } from 'iconsax-react';
import React, { useEffect, useState } from 'react'
import DateTimePicker from 'react-datetime-picker';
import { withRouter } from 'react-router-dom'
import { ToastErrorRight, ToastSuccessRight, ToastWarning, SelectPost, FormatDate, AlertDelete } from '../common';
import { callApi, IMAGES_DOMAIN } from '../services';
import useInfiniteScroll from '../hooks/useInfiniteScroll';


const ReportImages = (props) => {
    const [FromDate, setFromDate] = useState(new Date());
    const [ToDate, setToDate] = useState(new Date());
    const [PostId, setPostId] = useState(0);
    const [Historys, setHistorys] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
    const [backToTop, setBackToTop] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
        
    },[]);
    const handleScroll = () => {
        if (window.scrollY > 400) {
            setBackToTop(true);
        } else {
            setBackToTop(false);
        }
    }


    useEffect(() => {
        const role = JSON.parse(localStorage.getItem('role'));
        if (role === 'deployment') {
            props.history.push('/');
        }
        let d = new Date(), d2 = new Date();
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        setFromDate(d)
        d2.setHours(23)
        d2.setMinutes(59)
        d2.setSeconds(59)
        setToDate(d2)
    }, []);

   const upTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setBackToTop(false)
    }

    function fetchMoreListItems() {
        setTimeout(() => {
            if (listItems.length < Historys.length) {
                (listItems.length + 16 < Historys.length)
                    ? setListItems(prevState => ([...prevState, ...Historys.slice(prevState.length, prevState.length + 16)]))
                    : setListItems(prevState => ([...prevState, ...Historys.slice(prevState.length, Historys.length)]))
            }
            setIsFetching(false);
        }, 200);
    }

    const CPN_spTimeKeepingHistory_List = async () => {
        setHistorys([])
        setListItems([])
        try {
            const params = {
                Json: JSON.stringify({
                    FromDate: FormatDate(FromDate),
                    ToDate: FormatDate(ToDate),
                    PostId: PostId
                }),
                func: "CPN_spTimeKeepingHistory_List",
                API_key: "netcoApikey2025"
            }
            const res = await callApi.Main(params);
            if (res.length === 0 || !res.length) {
                ToastWarning("Không có dữ liệu")
                return;
            }
            setHistorys(res)
            if (res.length > 16) {
                setListItems(res.slice(0, 16))
                return
            }
            setListItems(res.slice(0, res.length))
        } catch (error) {
            console.log(error);
        }
    }

    const CPN_OfficerTimekeeping_Uncheck = async (user, type) => {
     
        try {
            const params = {
                Json: JSON.stringify({
                    Id: user.Id,
                    OfficerId: user.OfficerID,
                    Type: type,
                    DateUnCheck: user.TimeKeeping,
                    OfficerName: user.OfficerName,
                    LinkImage: user.LinkImage
                }),
                func: "CPN_spOfficerTimekeeping_Uncheck",
                API_key: "netcoApikey2025"
            }

            const res = await callApi.Main(params);

            if (res.Status === "NOTOK") {
                ToastErrorRight(res.ReturnMess)
                return;
            }
            ToastSuccessRight("Từ chối thành công")
            let newList = listItems.filter(item => item.Id !== user.Id)
            setListItems(newList)

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='content position-relative'>
            <div class="card  m-3" >
                <div class="card-header bg-transparent p-0 ">
                    <div class="row h-100 d-flex align-items-center">
                        <div class="col-8 col-md-6" >
                            <h3 class="card-title m-0 pl-2 font-weight-bold">
                                Xem lịch sử chấm công ({Historys?.length || 0})
                            </h3>
                        </div>
                        <div class="col-4 col-md-6">
                            <button
                                type="button"
                                class="btn btn-sm btn-success float-right mr-3 px-3"
                                onClick={CPN_spTimeKeepingHistory_List}
                            >
                                <Eye size="18" className='mr-1' />
                                Xem
                            </button>
                            {/* <button type="button" class="btn btn-sm btn-danger float-right mr-2 px-3"  >
                                <i class="fa fa-eye pr-2"></i>
                                asd
                            </button> */}
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row ">
                        <div class="col-sm-12 col-md-4" >
                            <div class="form-group">
                                <label class="label">Từ ngày<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                <div class="input-group SelectDatetime">

                                    <DateTimePicker class="form-control"
                                        onChange={date => setFromDate(date)}
                                        value={FromDate}
                                        format='MM/dd/yyyy HH:mm:ss'
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4"  >
                            <div class="form-group">
                                <label class="label">Đến ngày<sup style={{ color: '#dc3545' }}>(*)</sup></label>
                                <div class="input-group SelectDatetime">

                                    <DateTimePicker
                                        onChange={date => setToDate(date)}
                                        value={ToDate}
                                        format='MM/dd/yyyy HH:mm:ss'
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 col-md-4 ">
                            <div class="form-group">
                                <label class="label">Bưu cục</label>
                                <div class="input-group">
                                    <SelectPost
                                        AreaId={0}
                                        onSelected={e => setPostId(e.value)}
                                        onPost={PostId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        {
                            listItems.length > 0 && listItems.map((item, index) => {
                                return (
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3  d-flex justify-content-center align-items-center" key={index}>
                                        <div class="cards">
                                            <div class="card-custom">
                                                <img
                                                    src={`${IMAGES_DOMAIN}${item.LinkImage}`}
                                                    alt=""
                                                    class="card-image"
                                                />
                                                <div class="card-content">
                                                    <div class="card-top">
                                                        <h3 class="card-title">{item.OfficerName}</h3>
                                                        <i class="card-user-name text-muted">{item.DepartmentName}</i>
                                                        <p className='time-keeping'>Chấm công lúc: {item.TimeKeeping}</p>
                                                    </div>
                                                    <div class="card-bottom">
                                                        <button
                                                            class="card-live d-flex align-items-center "
                                                            onClick={() => AlertDelete(
                                                                'Bạn có muốn xóa không?',
                                                                'Không thể hoàn tác sau khi xóa',
                                                                'Xóa',
                                                                'Hủy bỏ',
                                                                () => CPN_OfficerTimekeeping_Uncheck(item, 1)
                                                            )}
                                                        >
                                                            <UserRemove size="14" />
                                                            <span >TC chấm vào</span>
                                                        </button>
                                                        <button
                                                            class="card-watching d-flex align-items-center "
                                                            onClick={() => AlertDelete(
                                                                'Bạn có muốn xóa không?',
                                                                'Không thể hoàn tác sau khi xóa',
                                                                'Xóa',
                                                                'Hủy bỏ',
                                                                () => CPN_OfficerTimekeeping_Uncheck(item, 2)
                                                            )}
                                                        >
                                                            <UserRemove size="14" />
                                                            <span className='pl-2'>TC chấm ra</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            isFetching &&
                            <div className='col-12 text-center'>Loading...</div>
                        }
                    </div>
                </div>
            </div>
            <button 
                className= {backToTop ? 'btn btn-success  position-fixed p-2' : 'd-none'}
                style={{ bottom: '20px', right: '10px' }}
                onClick={upTop}
            >
               <ArrowUp2 size="40" />
            </button>
        </div>
    )
}

export default withRouter(ReportImages);

