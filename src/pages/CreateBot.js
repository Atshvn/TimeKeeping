import React, { useRef, useState, useEffect } from 'react'
import { ToastWarningRight, DataTable, AlertDelete, SelectTopic, AlertWarning, AlertSuccess, } from '../common'
import { AddSquare, ArrowUp2, AddCircle, Magicpen, CloseCircle } from 'iconsax-react';
import ReactTable from 'react-table-6'
import { callApi } from '../services';
import { PieChart } from 'react-minimal-pie-chart';

const CreateBot = () => {

    // khai báo data dữ liệu
    const [dataCreate, setdataCreate] = useState([]);
    const [dataSubject, setdataSubject] = useState([]);
    const [dataRandom,setdataRandom] = useState([]);
    const [DataS, setDataS] = useState([]);

    //khai báo biến sửa đổi
    const [SubjectId, setSubjectId] = useState(0);
    const [ChatbotId, setChatbotId] = useState(0);
    const [IdRandom, setIdRandom] = useState(0);
    const [ChatbotAnswerId, setChatbotAnswerId] = useState(0);
    const [ChatbotQuestion, setChatbotQuestion] = useState(0);
    const [backToTop, setBackToTop] = useState(false);
    const [AddQuest, setAddQuest] = useState('');
    const [AddAnswer, setAddAnswer] = useState('')
    const [EditAnswer, setEditAnswer] = useState();
    const [EditQuest, setEditQuest] = useState();
    const [EditSubjects, setEditSubjects] = useState('')
    const [EditRandom, setEditRandom] = useState('')
    const [Special, setSpecial] = useState();


    //khai báo biến sử dụng
    const [Quest, setQuest] = useState('');
    const [Answer, setAnswer] = useState('');
    const [Subject, setSubject] = useState('');
    const [SubjectContent, setSubjectContent] = useState();
    const [txtSearch, setTxtSearch] = useState("");
    const [TextSearch, setTextSearch] = useState("");
    const [Chckbill, setChckbill] = useState();
    const [GetGood, setGetGood] = useState();
    const [Advise, setAdvise] = useState();
    const [All, setAll] = useState();
    const [Complaint, setComplaint] = useState();
    const [Violent, setViolent] = useState();
    const [Happy, setHappy] = useState();


    const slweb = parseInt(localStorage.getItem('Web'));
    const slmb = parseInt(localStorage.getItem('Mobile'));

    useEffect(() => {
        debugger

        Task_spChatbotSubjectAI_List();
        Task_spChatbotQuestion_List();
        Task_spRandomChatbotMessage_List();

    }, txtSearch);


    useEffect(() => {
        
        if (dataCreate !== '' && dataCreate !== undefined && dataCreate !== []) {
            Statistical();
        }

    }, [dataCreate])
    // quay về đầu trang
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, []);

    // scroll về đầu trang
    const handleScroll = () => {
        if (window.scrollY > 400) {
            setBackToTop(true);
        } else {
            setBackToTop(false);
        }
    }
    const upTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setBackToTop(false)
    }

    // Chức năng List

    // List Chủ đề
    const Task_spChatbotSubjectAI_List = async () => {
        let pr = {
            KeySearch: txtSearch,
            SubjectId: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotSubjectAI_List",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        setdataSubject(list);

    }
    //list random
    const Task_spRandomChatbotMessage_List = async () => {
        let pr = {
            KeySearch: '',
            IdRandom: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spRandomChatbotMessage_List",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        setdataRandom(list);


    }
    // List thực thể
    const Task_spChatbotQuestion_List = async () => {
        let pr = {
            KeySearch: txtSearch,
            ChatbotId: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotQuestion_List",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        setdataCreate(list);

    }

    // Chức năng Setitem

   
    //set chủ đề
    const onSelectTopic = (item) => {
        setSubjectId(item.value);
        setSubjectContent(item.label)

    }
    //set Edit chủ đề
    const EditSubject = (item) => {
        setEditSubjects(item.original.SubjectContent);
        setSubjectId(item.original.SubjectId);
    }
    const EditRandomtxt = (item) => {
        setIdRandom(item.original.IdRandom)
        setEditRandom(item.original.Message);
        setSubjectId(item.original.SubjectId);
        setSubjectContent(item.original.SubjectName);
    }

    //set Edit thực thể
    const EditEntity = (item) => {
        setChatbotId(item.original.ChatbotId);
        setChatbotAnswerId(item.original.ChatbotAnswerId)
        setSubjectId(item.original.SubjectId);
        setSubjectContent(item.original.SubjectName);
        setEditAnswer(item.original.ChatbotAnswer);
        setEditQuest(item.original.ChatbotQuestion);

    }

    // Chức năng lưu

    // Lưu thực thể
    const Task_spChatbotQuestion_Save = async () => {

        debugger    
        if (SubjectId === 0) {
            ToastWarningRight('Xin hãy chọn chủ đề');
            return;
        }

        if (Quest === '') {
            ToastWarningRight('Xin hãy nhập nội dung thực thể')
            return;
        }


        const numberstring = Quest.trim().split(' ').length
        console.log('aa',numberstring)

        let pr = {
            ChatbotId: 0,
            ChatbotQuestion: Quest,
            ChatbotAnswerId: 0,
            ChatbotAnswer: Answer,
            SubjectId: SubjectId,
            SubjectName: SubjectContent,
            IsSpecial: Special,
            Creator: 1,
            CreateTime: "",
            Editor: 1,
            EditTime: "",
            Isdelete: 0,
            Number: numberstring
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotQuestion_Save",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        AlertSuccess(list.Result);
        Task_spChatbotQuestion_List();
        setQuest('')
        setAnswer('')
    }
    // Lưu chủ đè
    const Task_spChatbotSubjectAI_Save = async () => {

        if (Subject === '') {
            ToastWarningRight('Xin nhập nội dung');
            return
        }

        let pr = {
            SubjectId: 0,
            SubjectContent: Subject,
            Creator: 1,
            CreateTime: '',
            Editor: 1,
            EditTime: '',
            Isdelete: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotSubjectAI_Save",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        AlertSuccess(list.Result);
        Task_spChatbotSubjectAI_List();
        Task_spChatbotQuestion_List();
        setSubject('');
    }

    const Task_spRandomChatbotMessage_Save = async () => {
        debugger
        if (SubjectId === 0) {
            ToastWarningRight('Xin hãy chọn chủ đề');
            return;
        }

        if (AddQuest === '') {
            ToastWarningRight('Xin hãy nhập nội dung thực thể')
            return;
        }


        let pr = {
            IdRandom: 0,
            SubjectId: SubjectId,
            SubjectName: SubjectContent,
            Message: AddQuest

        }
        console.log('pr', pr)
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spRandomChatbotMessage_Save",
            API_key: "netcoApikey2025"
        }
        debugger
        const list = await callApi.Main(params);
        AlertSuccess(list.Result);
        Task_spRandomChatbotMessage_List();
        setAddQuest('')
    }


    // Edit thực thể
    const Task_spChatbotQuestionEdit_Save = async () => {

        if (SubjectId === 0) {
            ToastWarningRight('Xin hãy chọn chủ đề');
            return;
        }

        if (EditQuest === '') {
            ToastWarningRight('Xin hãy nhập nội dung thực thể')
            return;
        }


        let pr = {
            ChatbotId: ChatbotId,
            ChatbotQuestion: EditQuest,
            ChatbotAnswerId: ChatbotAnswerId,
            ChatbotAnswer: EditAnswer,
            SubjectId: SubjectId,
            SubjectName: SubjectContent,
            IsSpecial: Special,
            Creator: 1,
            CreateTime: "",
            Editor: 1,
            EditTime: "",
            Isdelete: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotQuestion_Save",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        AlertSuccess(list.Result);
        Task_spChatbotQuestion_List();
        setQuest('')
        setAnswer('')
    }

    // Edit chủ đề
    const Task_spChatbotSubjectAIEdit_Save = async () => {

        if (EditSubjects === '') {
            ToastWarningRight('Xin nhập nội dung');
            return
        }
        let pr = {
            SubjectId: SubjectId,
            SubjectContent: EditSubjects,
            Creator: 1,
            CreateTime: '',
            Editor: 1,
            EditTime: '',
            Isdelete: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotSubjectAI_Save",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        AlertSuccess(list.Result);
        Task_spChatbotSubjectAI_List();
        Task_spChatbotQuestion_List();
        setSubject('');
    }

    //Edit câu mặc định
    const Task_spRandomChatbotMessageEdit_Save = async () => {

        if (EditRandom === '') {
            ToastWarningRight('Xin hãy nhập nội dung thực thể')
            return;
        }

        let pr = {
            IdRandom: IdRandom,
            SubjectId: SubjectId,
            SubjectName: SubjectContent,
            Message: EditRandom

        }
        console.log('pr', pr)
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spRandomChatbotMessage_Save",
            API_key: "netcoApikey2025"
        }
        debugger
        const list = await callApi.Main(params);
        AlertSuccess(list.Result);
        Task_spRandomChatbotMessage_List();
        setAddQuest('')
    }

    // Chức năng xóa


    // Xóa thực thể
    const Task_spChatbotQuestion_Delete = async (item) => {

        let pr = { ChatbotId: item.original.ChatbotId }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotQuestion_Delete",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        // AlertSuccess(list.Result);
        Task_spChatbotQuestion_List();
    }
    // Xóa chủ đề
    const Task_spChatbotSubjectAI_Delete = async (item) => {

        let pr = { SubjectId: item.original.SubjectId }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotSubjectAI_Delete",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        // AlertWarning(list.Result);
        Task_spChatbotSubjectAI_List();


    }

    const Task_spRandomChatbotMessage_Delete = async (item) => {

        let pr = { IdRandom: item.original.IdRandom }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spRandomChatbotMessage_Delete",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        // AlertWarning(list.Result);
        Task_spRandomChatbotMessage_List();

    }

    // Các chức năng khác

    //live search câu trả lời

    const handleSearch = () => {

        let search = Answer;
        let ulfilter = document.getElementById('mydatafilter')
        if (search !== '') {
            ulfilter.classList.remove('d-none')
            let datasearch = dataCreate.filter(p => p.ChatbotAnswer.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
            setDataS(datasearch);

        }
        else

            ulfilter.classList.add('d-none')

    }
    // filter table thực thể
    const QuestionFilter = () => {

        let qsfilter = TextSearch;
        if (qsfilter !== '') {
            let dataqsfilter = dataCreate.filter(p => p.ChatbotQuestion.toLocaleLowerCase().includes(qsfilter.toLocaleLowerCase())
                || p.ChatbotAnswer.toLocaleLowerCase().includes(qsfilter.toLocaleLowerCase())
                || p.SubjectName.toLocaleLowerCase().includes(qsfilter.toLocaleLowerCase()));
            setdataCreate(dataqsfilter)
        }


        else
            Task_spChatbotQuestion_List();


    }

    const setAnswers = (item) => {
        let ulfilter = document.getElementById('mydatafilter')
        setAnswer(item.ChatbotAnswer);
        ulfilter.classList.add('d-none')
    }
    const Statistical = () => {

        const a = dataCreate.filter(p => p.SubjectName === 'Tra cứu vận đơn')?.reduce((total, currentValue) => total = total + 1, 0);
        const b = dataCreate.filter(p => p.SubjectName === 'Tư vấn ,tham khảo dich vụ')?.reduce((total, currentValue) => total = total + 1, 0);
        const c = dataCreate.filter(p => p.SubjectId === 7)?.reduce((total, currentValue) => total = total + 1, 0);
        const d = dataCreate.filter(p => p.SubjectName === 'Khiếu nại')?.reduce((total, currentValue) => total = total + 1, 0);
        const e = dataCreate.filter(p => p.SubjectName === 'Chủ đề chung')?.reduce((total, currentValue) => total = total + 1, 0);
        const f = dataCreate.filter(p => p.SubjectName === 'Không thân thiện')?.reduce((total, currentValue) => total = total + 1, 0);
        const g = dataCreate.filter(p => p.SubjectName === 'Thân thiện')?.reduce((total, currentValue) => total = total + 1, 0);
        setChckbill(a)
        setGetGood(c)
        setAdvise(b)
        setAll(e)
        setComplaint(d)
        setViolent(f)
        setHappy(g)

    }

    // table thực thể
    const columns = [
        {
            Header: 'Option',
            filterable: false,
            fixed: "left",
            accessor: '[row identifier to be passed to button]',
            width: 180,
            Cell: (item) =>
                <span >

                    <button class='btn btn-sm btn-success btn-xs '
                        style={{ color: 'white' }}
                        id='edbtn'
                        title='edit thực thể'
                        data-toggle="modal"
                        data-target="#addtopic"
                        onClick={() => EditEntity(item)} >
                        <Magicpen size="15" color="white" style={{ marginRight: '5px' }}

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
                            () => Task_spChatbotQuestion_Delete(item))}
                    >
                        <CloseCircle size="15" color="white" /> Delete
                    </button>

                </span>
        },
        {
            Header: ' Chủ đề',
            accessor: "SubjectName",
            width: 200
        },
        // {
        //     Header: ' Number',
        //     accessor: "Number",
        //     width: 200
        // },

        {
            Header: 'Thực thể',
            accessor: "ChatbotQuestion",
            width: 250
        },

        // {
        //     Header: 'đặc biệt',
        //     accessor: "IsSpecial",
        //     width: 100
        // },

        {
            Header: 'Định nghĩa thực thể',
            accessor: "ChatbotAnswer",
            width: 300
        },

    ]

    const columnrandom = [
        {
            Header: 'Option',
            filterable: false,
            fixed: "left",
            accessor: '[row identifier to be passed to button]',
            width: 180,
            Cell: (item) =>
                <span >

                    <button class='btn btn-sm btn-success btn-xs '
                        style={{ color: 'white' }}
                        id='edbtn'
                        title='edit thực thể'
                        data-toggle="modal"
                        data-target="#editrandom"
                        onClick={() => EditRandomtxt(item)} >
                        <Magicpen size="15" color="white" style={{ marginRight: '5px' }}

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
                            () => Task_spRandomChatbotMessage_Delete(item))}
                    >
                        <CloseCircle size="15" color="white" /> Delete
                    </button>

                </span>
        },
        {
            Header: ' Chủ đề',
            accessor: "SubjectName",
            width: 150
        },

        {
            Header: 'Nội dung',
            accessor: "Message",
            width: 400
        },

    ]
    // table chủ đề
    const column2 = [

        {
            Header: 'Option',
            filterable: false,
            fixed: "left",
            accessor: '[row identifier to be passed to button]',
            width: 180,
            Cell: (item) =>
                <span >

                    <button class='btn btn-sm btn-success btn-xs btn-edit'
                        title='Edit'
                        data-toggle="modal"
                        data-target="#editCD"
                        onClick={() => EditSubject(item)}
                    >
                        <Magicpen size="18" /> Edit
                    </button>

                    <button class='btn btn-sm btn-danger btn-xs btn-edit'
                        title='Xóa'
                        onClick={() => AlertDelete(
                            'Bạn có muốn xóa không?',
                            'Không thể hoàn tác sau khi xóa',
                            'Xóa',
                            'Hủy bỏ',
                            () => Task_spChatbotSubjectAI_Delete(item))}
                    >
                        Delete
                    </button>

                </span>
        },

        {
            Header: ' Chủ đề',
            accessor: "SubjectContent",
            width: 200
        },

    ]
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
                            Create Bot
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
                            Chatbot Statistical(Thống kê Chatbot)
                        </a>
                    </li>

                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div class="card-body">
                            <div class="row ">
                                {/* Create bot */}
                                <div class="col-sm-12 col-md-8 " >
                                    <div class="form-group ">
                                        <h3 class='margin-bot-5 text-cd'>TẠO THỰC THỂ    ( {dataCreate.length} )</h3>


                                        <div class='col-sm-12 col-md-12 margin-bot-10'>
                                            <div class='row'>

                                                <div class='col-sm-12 col-md-12 margin-bot-10'>


                                                    <input
                                                        class='form-control mt-5'
                                                        value={TextSearch}
                                                        onChange={e => setTextSearch(e.target.value)}
                                                        onKeyPress={QuestionFilter}


                                                    >

                                                    </input>
                                                    <button class='btn btn-sm btn-warning btn-xs pull-right margin-left-10 mt-2'
                                                        type='button' id='addbtn' style={{ color: 'white' }} title='Thêm'
                                                        data-toggle="modal"
                                                        data-target="#addquest"
                                                    >
                                                        <AddSquare size="15" color="white" style={{ marginRight: '5px' }} />
                                                        Thêm
                                                    </button>

                                                </div>
                                            </div>
                                        </div>

                                        <div class='col-sm-12 col-md-12 '>

                                            <DataTable

                                                data={dataCreate}
                                                columns={columns}
                                                row={5}
                                            />
                                        </div>
                                    </div>

                                </div>
                                {/*Chủ đề*/}
                                <div class="col-sm-12 col-md-4  mt-5" >
                                    <div class="form-group margin-left-5 mt-2">
                                        <h2 class='text-color'>CÁC CHỦ ĐỀ CHO THỰC THỂ</h2>
                                    </div>
                                    <div class='col-sm-12 col-md-12'>
                                        <div class='row'>
                                            <div class='col-sm-12 col-md-12 margin-bot-15 '>
                                                <button class='btn btn-sm btn-warning btn-xs pull-right margin-left-10'
                                                    type='button' id='addbtn' style={{ color: 'white' }} title='Thêm'
                                                    data-toggle="modal"
                                                    data-target="#addCD"
                                                >
                                                    <AddSquare size="15" color="white" style={{ marginRight: '5px' }} />
                                                    Thêm Chủ Đề
                                                </button>
                                            </div>

                                            <div class='col-sm-12 col-md-12 mt-5'>
                                                <DataTable
                                                    data={dataSubject}
                                                    columns={column2}

                                                />
                                            </div>

                                            {/*Tạo câu mặc định */}
                                            <div
                                                class="modal fade"
                                                id="addrandom"
                                                tabindex="-1"
                                                role="dialog"
                                                aria-hidden="true"
                                            >
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content modal-login p-3">
                                                        <div class="modal-header border-bottom-0 position-relative">
                                                            <div className="d-flex flex-column align-items-center justify-content-center w-100 ">
                                                                <h3 class="modal-title mt-3 title-login text-cd" id="changeTopic">Tạo câu mặc định</h3>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                class="close position-absolute btn-close d-flex align-items-center justify-content-center"
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div className="row">
                                                                <div className="col-12">

                                                                    <div class="form-group">
                                                                        <h2 class='ml-0 text-color'>Chủ đề : </h2>
                                                                        <SelectTopic
                                                                            onSelected={e => onSelectTopic(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div class='form-group'>
                                                                        <h2 class='ml-0 text-color'>Nội dung :</h2>
                                                                        <textarea
                                                                            class='form-control'
                                                                            style={{ height: '200px' }}
                                                                            value={AddQuest}
                                                                            onChange={e => setAddQuest(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="modal-footer p-0  border-0">
                                                                <button
                                                                    type="button"
                                                                    data-dismiss="modal"
                                                                    class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                                                                    onClick={Task_spRandomChatbotMessage_Save}
                                                                >
                                                                    Xác nhận
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* thêm chủ đề mới*/}

                                            <div
                                                class="modal fade"
                                                id="addCD"
                                                tabindex="-1"
                                                role="dialog"
                                                aria-hidden="true"
                                            >
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content modal-login p-3">
                                                        <div class="modal-header border-bottom-0 position-relative">
                                                            <div className="d-flex flex-column align-items-center justify-content-center w-100 ">
                                                                <h3 class="modal-title mt-3 title-login text-cd" id="changeTopic">THÊM CHỦ ĐỀ</h3>

                                                            </div>
                                                            <button
                                                                type="button"
                                                                class="close position-absolute btn-close d-flex align-items-center justify-content-center"
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">

                                                            <div class="form-group ">
                                                                <h2 className='ml-0 text-color'>Nội dung chủ đề  :  <span class='important' type='text'> *</span></h2>

                                                                <input class='form-control'
                                                                    value={Subject}
                                                                    onChange={e => setSubject(e.target.value)}

                                                                />

                                                            </div>

                                                            <button
                                                                type="button"
                                                                class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                                                                onClick={Task_spChatbotSubjectAI_Save}
                                                            >
                                                                Thêm
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Edit chủ đề*/}

                                            <div
                                                class="modal fade"
                                                id="editCD"
                                                tabindex="-1"
                                                role="dialog"
                                                aria-hidden="true"
                                            >
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content modal-login p-3">
                                                        <div class="modal-header border-bottom-0 position-relative">
                                                            <div className="d-flex flex-column align-items-center justify-content-center w-100 ">
                                                                <h3 class="modal-title mt-3 title-login text-cd" id="changeTopic">EDIT CHỦ ĐỀ</h3>

                                                            </div>
                                                            <button
                                                                type="button"
                                                                class="close position-absolute btn-close d-flex align-items-center justify-content-center"
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div class="form-style">

                                                                <div class="form-group ">
                                                                    <h2 className='ml-0 text-color'>Nội dung chủ đề  :  <span class='important' type='text'> *</span></h2>

                                                                    <input class='form-control'
                                                                        value={EditSubjects}
                                                                        onChange={e => setEditSubjects(e.target.value)}

                                                                    />
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                                                                    data-dismiss="modal"
                                                                    onClick={Task_spChatbotSubjectAIEdit_Save}
                                                                >
                                                                    Lưu lại
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* Edit câu mặc định*/}

                                            <div
                                                class="modal fade"
                                                id="editrandom"
                                                tabindex="-1"
                                                role="dialog"
                                                aria-hidden="true"
                                            >
                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content modal-login p-3">
                                                        <div class="modal-header border-bottom-0 position-relative">
                                                            <div className="d-flex flex-column align-items-center justify-content-center w-100 ">
                                                                <h3 class="modal-title mt-3 title-login text-cd" id="changeTopic">EDIT Câu Mặc Định</h3>

                                                            </div>
                                                            <button
                                                                type="button"
                                                                class="close position-absolute btn-close d-flex align-items-center justify-content-center"
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div class="form-style">

                                                                <div class="form-group ">
                                                                    <h2 className='ml-0 text-color'>Nội dung :  <span class='important' type='text'> *</span></h2>

                                                                    <textarea class='form-control'
                                                                        style={{ height: '200px' }}
                                                                        value={EditRandom}
                                                                        onChange={e => setEditRandom(e.target.value)}

                                                                    />
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                                                                    data-dismiss="modal"
                                                                    onClick={Task_spRandomChatbotMessageEdit_Save}
                                                                >
                                                                    Lưu lại
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* tạo thực thể */}
                                            <div
                                                class="modal fade"
                                                id="addquest"
                                                tabindex="-1"
                                                role="dialog"
                                                aria-hidden="true"
                                            >

                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content modal-login p-3">
                                                        <div class="modal-header border-bottom-0 position-relative">
                                                            <div className="title col-12 d-flex justify-content-center font-weight-bold align-items-center mt-3 mb-2">
                                                                <h3 className='font-weight-bold text-cd'>TẠO THỰC THỂ</h3>
                                                            </div>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div class='form-group mb-4'>
                                                                <h2 className='ml-0 text-color'>Chủ đề :</h2>
                                                                <SelectTopic
                                                                    onSelected={e => onSelectTopic(e)}
                                                                />
                                                            </div>
                                                            <div class='form-group  mb-4' >
                                                                <h2 className='ml-0 text-color'>Câu hỏi :   <span class='important' type='text'> *</span></h2>
                                                                <input class='form-control w-100'
                                                                    value={Quest}
                                                                    onChange={e => setQuest(e.target.value)}
                                                                />
                                                            </div>

                                                            <div class='form-group  mb-4'>
                                                                <h2 className='ml-0 text-color'>Câu trả lời :</h2>
                                                                <textarea class='form-control ' style={{ height: '200px' }}
                                                                    id='answer'
                                                                    value={Answer}
                                                                    onChange={e => setAnswer(e.target.value)}
                                                                    onKeyPress={(e) => handleSearch()}

                                                                />
                                                            </div>

                                                            <div class='form-group  mb-4'>
                                                                <h2 className='ml-0 text-color'>Chủ đề đặc biệt :
                                                                    <a class='ml-2'>Thường   <input class='form-group ml-1 '
                                                                        id='answer'
                                                                        name='check'
                                                                        type={'radio'}
                                                                        onClick={() => setSpecial(0)} /></a>


                                                                    <a class='ml-3'>Đặc biệt   <input class='form-group ml-1 '
                                                                        id='answer'
                                                                        name='check'
                                                                        type={'radio'}
                                                                        onClick={() => setSpecial(1)} /></a>

                                                                </h2>



                                                            </div>
                                                            <div class="col-md-12 ">

                                                                <ul id="mydatafilter"  >
                                                                    {DataS.map((item, index) => {
                                                                        return <li value={item.ChatbotAnswerId}
                                                                            onClick={() => setAnswers(item)}
                                                                        >{item.ChatbotAnswer}

                                                                        </li>

                                                                    })}
                                                                </ul>
                                                            </div>



                                                        </div>
                                                        <div className="modal-footer border-0 py-0">
                                                            <button
                                                                type="button"
                                                                class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                                                                onClick={Task_spChatbotQuestion_Save}
                                                            >
                                                                Thêm thực thể
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            class="close position-absolute btn-close d-flex align-items-center justify-content-center"
                                                            data-dismiss="modal"
                                                            aria-label="Close"
                                                        >
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>

                                            {/* Định nghĩa thực thể*/}
                                            <div
                                                class="modal fade"
                                                id="addtopic"
                                                tabindex="-1"
                                                role="dialog"
                                                aria-hidden="true"
                                            >

                                                <div class="modal-dialog" role="document">
                                                    <div class="modal-content modal-login p-3">
                                                        <div class="modal-header border-bottom-0 position-relative">
                                                            <div className="d-flex flex-column align-items-center justify-content-center w-100 ">
                                                                <h3 class="modal-title mt-3 title-login text-cd" id="changeTopic">Định Nghĩa Lại Thực Thể</h3>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                class="close position-absolute btn-close d-flex align-items-center justify-content-center"
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div class='form-group margin-top-20'>
                                                                        <h2 className='ml-0 text-color'>Thực thể :</h2>
                                                                        <input
                                                                            class='form-control'
                                                                            value={EditQuest}
                                                                            onChange={item => setEditQuest(item.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div class='form-group margin-top-10'>
                                                                        <h2 className='ml-0 text-color'>Câu trả lời:</h2>
                                                                        <textarea
                                                                            style={{ height: '200px' }}
                                                                            class='form-control'
                                                                            value={EditAnswer}
                                                                            onChange={item => setEditAnswer(item.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div class='form-group  mb-4 mt-2 ml-3'>
                                                                    <h2 className='ml-0 text-color'>Chủ đề đặc biệt :
                                                                        <a class='ml-2'>Thường   <input class='form-group ml-1 '
                                                                            id='answer'
                                                                            name='check'
                                                                            type={'radio'}
                                                                            onClick={() => setSpecial(0)} /></a>


                                                                        <a class='ml-3'>Đặc biệt   <input class='form-group ml-1 '
                                                                            id='answer'
                                                                            name='check'
                                                                            type={'radio'}
                                                                            onClick={() => setSpecial(1)} /></a>

                                                                    </h2>

                                                                </div>
                                                            </div>
                                                            <div className="modal-footer border-0 py-0">
                                                                <button
                                                                    type="button"
                                                                    class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                                                                    data-dismiss="modal"
                                                                    onClick={Task_spChatbotQuestionEdit_Save}
                                                                >
                                                                    Định nghĩa
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*Random Message */}
                                <div class="col-sm-12 col-md-12 mt-4" >
                                    <div class="form-group ">
                                        <h2 class='text-color'>CÁC CÂU MẶT ĐỊNH</h2>


                                        <div class='col-sm-12 col-md-12 margin-bot-10'>
                                            <div class='row'>

                                                <div class='col-sm-12 col-md-7 margin-bot-10'>

                                                    <button class='btn btn-sm btn-warning btn-xs pull-right margin-left-10 mt-2'
                                                        type='button' id='addbtn' style={{ color: 'white' }} title='Thêm'
                                                        data-toggle="modal"
                                                        data-target="#addrandom"
                                                    >
                                                        <AddSquare size="15" color="white" style={{ marginRight: '5px' }} />
                                                        Thêm
                                                    </button>

                                                </div>
                                            </div>
                                        </div>

                                        <div class='col-sm-12 col-md-7 '>

                                            <DataTable

                                                data={dataRandom}
                                                columns={columnrandom}

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab" >
                        <div class="col-sm-12 col-md-12 ">
                            <div class='row'>
                                <div class="col-sm-12 col-md-6 mt-5">
                                    <div class='row'>
                                        <div class="col-sm-12 col-md-4  mt-5">
                                            <PieChart
                                                data={[
                                                    { title: 'Lấy-Nhận hàng', value: GetGood, color: '#FF99FF' },
                                                    { title: 'Khiếu nại', value: Complaint, color: '#FFCC66' },
                                                    { title: 'Tư vấn ,tham khảo dich vụ', value: Advise, color: '#FF9900' },
                                                    { title: 'Tra cứu vận đơn', value: Chckbill, color: '#1bbb7b' },
                                                    { title: 'Chủ đề chung', value: All, color: '#33FFFF' },
                                                    { title: 'Thân thiện', value: Happy, color: '#8a51af' },
                                                    { title: 'Không thân thiện', value: Violent, color: '#dd8888' },
                                                ]}
                                            />
                                            {/* <Chart/> */}
                                        </div>

                                        <div class='col-sm-12 col-md-6 mt-5'>
                                            <div class="col-sm-12 col-md-12 mt-4 ml-4">
                                                <h2 class='text-color'>
                                                    Tra cứu vận đơn : {Chckbill}
                                                </h2>
                                                <h2 class='select2'>
                                                    Lấy-Nhận hàng : {GetGood}
                                                </h2>
                                                <h2 class='select3'>
                                                    Tư vấn ,tham khảo dich vụ : {Advise}
                                                </h2>
                                                <h2 class='select5'>
                                                    Khiếu nại :  {Complaint}
                                                </h2>
                                                <h2 class='select4'>
                                                    Chủ đề chung: {All}
                                                </h2>
                                                <h2 class='select6'>
                                                    Thân thiện: {Happy}
                                                </h2>

                                                <h2 class='select7'>
                                                    Không thân thiện: {Violent}
                                                </h2>


                                            </div>

                                        </div>

                                        <div class="col-sm-12 col-md-12 mt-5 ">
                                            <h2 class='text-color'>
                                                Thống kê số lượng các thực thể đã được tạo
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12 col-md-6 mt-5" >
                                    <div class='row'>
                                        <div class="col-sm-12 col-md-4  mt-5">
                                            <PieChart
                                                data={[
                                                    { title: 'Mobile', value: slmb, color: '#FF99FF' },
                                                    { title: 'Web', value: slweb, color: '#FFCC66' },
                                                    { title: 'Zalo', value: 0, color: '#FF9900' },
                                                    { title: 'Facebook', value: 0, color: '#1bbb7b' },

                                                ]}
                                            />
                                            {/* <Chart/> */}
                                        </div>

                                        <div class='col-sm-12 col-md-6 mt-5'>
                                            <div class="col-sm-12 col-md-12 mt-4 ml-4">
                                                <h2 class='select2'>
                                                    Mobile : {slmb}
                                                </h2>
                                                <h2 class='select5'>
                                                    Web : {slweb}
                                                </h2>
                                                <h2 class='select3'>
                                                    Zalo : {null}
                                                </h2>
                                                <h2 class='text-color'>
                                                    Facebook :{null}
                                                </h2>

                                            </div>

                                        </div>

                                        <div class="col-sm-12 col-md-12 mt-5 ">
                                            <h2 class='text-color'>
                                                Thống kê lượng truy cập Chatbot qua các nền tảng
                                            </h2>
                                        </div>
                                    </div>

                                </div>

                                {/* <div class="col-sm-12 col-md-12 mt-5">
                                    <div class='row'>
                                        <div class="col-sm-12 col-md-2 mt-5">
                                            <PieChart
                                                data={[
                                                    { title: 'Lấy-Nhận hàng', value: GetGood, color: '#FF99FF' },
                                                    { title: 'Khiếu nại', value: Complaint, color: '#FFCC66' },
                                                    { title: 'Tư vấn ,tham khảo dich vụ', value: Advise, color: '#FF9900' },
                                                    { title: 'Tra cứu vận đơn', value: Chckbill, color: '#1bbb7b' },
                                                    { title: 'Chủ đề chung', value: All, color: '#33FFFF' },
                                                ]}
                                            />
                                           
                                        </div>

                                        <div class='col-sm-12 col-md-6 mt-5'>
                                            <div class="col-sm-12 col-md-12 mt-4 ml-4">
                                                <h2 class='text-color'>
                                                    Tra cứu vận đơn : {Chckbill}
                                                </h2>
                                                <h2 class='select2'>
                                                    Lấy-Nhận hàng : {GetGood}
                                                </h2>
                                                <h2 class='select3'>
                                                    Tư vấn ,tham khảo dich vụ : {Advise}
                                                </h2>
                                                <h2 class='select5'>
                                                    Khiếu nại :  {Complaint}
                                                </h2>
                                                <h2 class='select4'>
                                                    Chủ đề chung: {All}
                                                </h2>

                                            </div>

                                        </div>

                                        <div class="col-sm-12 col-md-12 mt-5 ">
                                            <h2 class='text-color'>
                                                Thống kê chủ đề được hỏi nhiều nhất
                                            </h2>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <button
                className={backToTop ? 'btn btn-success  position-fixed p-2' : 'd-none'}
                style={{ bottom: '20px', right: '10px' }}
                onClick={upTop}
            >
                <ArrowUp2 size="40" />
            </button>
        </div >
    )


}
export default CreateBot