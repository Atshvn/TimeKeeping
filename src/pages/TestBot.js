import React, { useRef, useState, useEffect } from 'react'
import { SelectTopic } from '../common'
import { Send, Eye } from 'iconsax-react';
import { callApi } from '../services';
import { FormatDate, AlertSuccess } from '../common'

import parse from 'html-react-parser'


const TestBot = () => {

    const [dataSubject, setdataSubject] = useState([]);
    const [dataAnswer, setdataAnswer] = useState([]);
    const [dataChat, setdataChat] = useState([]);
    const [SubjectId, setSubjectId] = useState(0);
    const [txtSearch, setTextSearch] = useState("");
    const [Question, setQuestion] = useState();
    const [dataChatList, setdataChatList] = useState([])
    const [dataRandom, setdataRandom] = useState([]);
    const [dataLogbot, setdataLogbot] = useState([])
    const [backToTop, setBackToTop] = useState(false);
    const [Web, setWeb] = useState();
    const [Mobile, setMobile] = useState();
    const [HighestPercent, setHighestPercent] = useState(0);



    useEffect(() => {
        Task_spRandomChatbotMessage_List();
      
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, []);
    const upTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setBackToTop(false)
    }
    const handleScroll = () => {
        if (window.scrollY > 400) {
            setBackToTop(true);
        } else {
            setBackToTop(false);
        }
    }

    useEffect(() => {
        localStorage.setItem('Web', null)
        localStorage.setItem('Mobile', null)
        localStorage.setItem("Waybills", null);
    }, [])

    //danh sách chủ đề
    useEffect(() => {

        Task_spChatbotSubjectAI_List();
        Task_spChatbot_LogMessage_GetNotify();

    }, [txtSearch])


    const back = useRef(null)
    useEffect(() => {
        back.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, [dataChat]);

    let rdtext = 'Xin chào Anh/Chị em có thể giúp được gì ?';
    let randomlist = dataRandom.filter(p => p.SubjectName === 'Welcome')
    let rd = randomlist[Math.floor(Math.random() * dataRandom.length)];
    if (rd !== '' && rd !== undefined) {

        rdtext = rd.Message;

    }

    let hello = {
        Key: "NetcoBot",
        Result: rdtext,
        Keys: 0
    }

    // lọc câu hỏi theo chủ đề

    useEffect(() => {
        localStorage.setItem("NearAsk", null);

        Task_spChatbotQuestion_ListBySubjectId();
    }, [SubjectId])

    //welcome
    useEffect(() => {
        setTimeout(() => {
            dataChat.push(hello);

        }, 1000)
    }, [ChatKH])

    useEffect(() => {
        if (dataChatList !== '' && dataChatList !== undefined && dataChatList !== []) {
            MWStatistical();
        }

    }, [dataChatList])

    useEffect(() => {
        if (dataChatList !== '' && dataChatList !== undefined && dataChatList !== []) {
            QSStatistical();
        }

    }, [dataChatList])




    const MWStatistical = () => {
        const a = dataChatList.filter(p => p.Type === 'Web' && p.Name_Send.slice(-3) !== 'Bot')?.reduce((total, currentValue) => total = total + 1, 0);
        const b = dataChatList.filter(p => p.Type === 'mobile' && p.Name_Send !== 'Bot')?.reduce((total, currentValue) => total = total + 1, 0);

        setWeb(a);
        setMobile(b);
        localStorage.setItem('Web', a)
        localStorage.setItem('Mobile', b)

    }

    const QSStatistical = () => {
        const a = dataChatList.reduce((total, currentValue) => total = total + currentValue.ChatbotId, 0)
        let b = 0;
        dataChatList.map((item, index) => {
            item.ChatbotId += item.ChatbotId
            return b = item.ChatbotId
        })

    }

    useEffect(() => {
        ActionChat();
    }, [Question])
    // xử lí câu hỏi
    const ActionChat = async () => {

        let datasearch = [...dataAnswer];
        let dtarandom = dataRandom.filter(p => p.SubjectName === 'Respond')
        let randomtxt = 'Dạ, vấn đề này em không thể giải quyết, A/C có thể hỏi vấn đề khác hoặc có thể liên hệ với tổng đài 19006463-02438356356'
        let random = dtarandom[Math.floor(Math.random() * dataRandom.length)];
        if (random !== '' && random !== undefined) {
            randomtxt = random.Message;
        }


        // kiểm tra câu hỏi có phải là mã đơn hàng hay ko?

        const NearAsk = localStorage.getItem("NearAsk");

        // kiểm tra câu hỏi gần nhất có liên quan đén hỏi thông tin đơn hàng không?

        const entity = CheckResult(Question?.Result, datasearch);
        const keysp = false;

        const dataChatAll = dataChat.filter(p => p.Key === 'User')?.reduce((total, currentValue) => total = total + ' ' + currentValue.Result, '') + ' ' + Question?.Result;
        let AVdataChatAll = removeAccents(dataChatAll).replace(',', ' ')
            .trim()
            .split(' ')
            .map(element => element.trim())
            .filter(element => element !== '')

        let waybillAll = CheckWaybill(AVdataChatAll); // kiểm tra có đơn hàng trong câu hỏi hiện tại


        let Cwaybillold = await localStorage.getItem("Waybills");

        if (Cwaybillold.includes(waybillAll))
            waybillAll = "";



        const AV = removeAccents(Question.Result).replace(',', ' ')
            .trim()
            .split(' ')
            .map(element => element.trim()) // bỏ các ký tự rỗng nằm giửa các câu
            .filter(element => element !== '') // bỏ các phần tử rỗng

        let waybillAv = CheckWaybill(AV); // kiểm tra có đơn hàng trong câu hỏi hiện tại
        if (Cwaybillold.includes(waybillAv) && waybillAv !== "") {
            const viewmsgold = {
                Key: "NetcoBot",
                Result: "Vận đơn này em đã trả lời thông tin bên trên rồi ạ ? (A/C có thể liên hệ trực tiếp với tổng đài 19006463 - 024 38 356 356 )",
                Keys: 0
            }

            // lưu câu hỏi gần nhất
            const dataviewold = [...dataChat];
            localStorage.setItem("NearAsk", Question?.Result);
            dataviewold.push(viewmsgold);
            Task_spChatbot_LogMessage_Save(11, 28, viewmsgold.Result, 'Bot', 'IT',);
            setdataChat(dataviewold);
            return;
        }
        if (

            //(entity.IsSpecial && entity.Percet >= 30)
            // || (NearAsk !== 'null' && CheckResult(NearAsk, datasearch).Percet >= 30) //câu hỏi gần nhất
            waybillAll !== ""
            || waybillAv !== ""
        ) {

            let ladingcode = waybillAv;

            //kiểm tra và tra mã vận đơn
            ladingcode = waybillAll !== "" ? ladingcode = waybillAll : ladingcode;
            if (ladingcode !== "") {


                const params = {
                    Json: '{\"KeySearch\":\"' + ladingcode.trim() + '\"}',
                    func: "Task_spChatbot_TrackingBill",
                    API_key: "netcoApikey2025"
                };

                const list = await callApi.Main(params);
                const datareturn = list;
                const today = new Date;
                console.log('dta', datareturn)



                console.log('aaa', datareturn[0].DealineTime)
                if (datareturn !== "" && datareturn !== undefined) {
                    if (datareturn[0].DealineTime < today) {

                        datareturn.DealineTime = today.getDate() + 1
                    }

                    if (datareturn.Recipient_reality === undefined) {
                        datareturn.Recipient_reality = 'Unknown'
                    }

                    let ResultBill = '';

                    datareturn.forEach(element => {
                        ResultBill +=


                            "<p> Dạ đơn hàng :" + ' <h style="color :#1bbb7b">' + element.Code.toUpperCase() + '</h>' + " </p> <br> "

                            + "<p>Trạng thái đơn hàng  :" + ' <h style="color :green">' + element.StatusName + '</h>' + "</p> <br>"

                            + "<p> Người nhận thực tế : " + ' <h style="color :green">' + element.Recipient_reality + '</h>' + "</p> <br>"

                            + "<p>Thời gian dự kiến giao :" + ' <h style="color :red">' + FormatDate(element.DealineTime) + '</h>' + "</p> <br> "

                            + (element.StatusId === 6 ? ("<p> Ngày nhận hàng :" + ' <h style="color :red">' + FormatDate(element.FinishDate) + '</h>' + "</p> <br> ") : "")

                            + '<p>Thông tin nhân viên chăm sóc KH :' + ' <h style="color :#1bbb7b">' + element.CustomerServiceInfor + '</h>' + "</p> <br>"

                            + (element.COD > 0 ? ("<p > COD : " + ' <h style="color :green">' + element.COD + '  ' + 'vnd' + '</h>' + "</p> <br>") : "")

                            ;

                    });

                    //kiểm tra và tra mã vận đơn       
                    let chk = {
                        Key: "NetcoBot",
                        Result: ResultBill,
                        Keys: 0
                    };

                    const dataview = [...dataChat];
                    dataview.push(chk);
                    setdataChat(dataview);
                    Task_spChatbot_LogMessage_Save(11, 28, chk.Result, 'Bot', 'IT', 649);
                    // keysp = true;
                    //xóa câu hỏi cũ
                    setQuestion('');
                    setChatKH('');

                    const waybillold = await localStorage.getItem("Waybills");
                    localStorage.setItem("Waybills", waybillold === "null" ? "_ok_" + ladingcode : waybillold + '_ok_ ' + ladingcode);
                    let wb = localStorage.getItem('Waybills')

                    return;
                }

                // trường hợp ko tìm thấy đơn       
                else {

                    let undf = {
                        Key: "NetcoBot",
                        Result: randomtxt,
                        Keys: 0
                    }
                    const dataview = [...dataChat];
                    dataview.push(undf);
                    setdataChat(dataview);
                    Task_spChatbot_LogMessage_Save(11, 28, undf.Result, 'Bot', 'IT', 649);
                    const waybillold = await localStorage.getItem("Waybills");
                    localStorage.setItem("Waybills", waybillold === "null" ? "_ok_" + ladingcode : waybillold + '_ok_ ' + ladingcode);
                    let wb = localStorage.getItem('Waybills')
                    //xóa câu hỏi cũ
                    setQuestion('');
                    setChatKH('');
                    return;
                }
            }


        }


        if (keysp) return;
        const viewmsg = {
            Key: "NetcoBot",
            Result: entity.Percet < 50 ? randomtxt : entity.ChatbotAnswer,
            Keys: 0
        }

        // lưu câu hỏi gần nhất
        localStorage.setItem("NearAsk", Question.Result);
        const dataview = [...dataChat];
        dataview.push(viewmsg);
        Task_spChatbot_LogMessage_Save(11, 28, viewmsg.Result, 'Bot', 'IT', entity.ChatbotId);
        setdataChat(dataview);

    }


    // đưa vào 1 chuổi và 1 mảng data, sẽ trả về đối tượng tìm kiếm có % đúng nhất
    const CheckResult = (Result, dataprocess) => {
        debugger
        let Arquestion = Result !== undefined && removeAccents(Result).replace(',', ' ')
            .trim()
            .split(' ')
            .map(element => element.trim()) // bỏ các ký tự rỗng nằm giửa các câu
            .filter(element => element !== '') // bỏ các phần tử rỗng

        let datadkm = dataprocess.map((item, index) => {
            return {
                ChatbotId: item.ChatbotId,
                ChatbotQuestion: item.ChatbotQuestion,
                ChatbotAnswer: item.ChatbotAnswer,
                SubjectName: item.SubjectName,
                SubjectId: item.SubjectId,
                IsSpecial: item.IsSpecial,
                Percet: 0,
                Number: item.Number
            }
        });

        //return
        Arquestion && Arquestion.forEach(element => { // lặp qua từng câu trong câu hỏi

            datadkm.forEach(item => { // lặp qua data câu hỏi
                const newitem = item.ChatbotQuestion.split(' ').map(elt => elt.trim()) // bỏ các ký tự rỗng nằm giửa các câu
                    .filter(elt => elt !== '') // bỏ các phần tử rỗng; // cắt từng câu trong câu hỏi

                const newitempercent = 100 / parseInt(Arquestion.length); // tính số % trong câu trả lời
                newitem.forEach((itm, index) => {
                    if (element === removeAccents(itm)) // nếu từng câu trong câu hỏi, giống với câu trả lời
                    {
                        // itemok.Percet = itemok.Percet === undefined ? newitempercent : itemok.Percet + newitempercent;
                        // resultsSearch.push(itemok);
                        let percent = 0;
                        if (item.Percet === undefined) {
                            percent = newitempercent
                        }
                        else if ((item.Percet + newitempercent) >= 100) {
                            percent = 100;
                        }
                        else {
                            percent = item.Percet + newitempercent;
                        }

                        datadkm.find(p => p.ChatbotId === item.ChatbotId).Percet = percent;
                        // datadkm.find(p => p.ChatbotId === item.ChatbotId).Percet = item.Percet === undefined ? newitempercent : item.Percet + newitempercent;
                    }
                })
            });
        });



        // let check = datadkm.filter(p => p.Percet > 0).sort((a, b) => parseFloat(a.Number) - parseFloat(b.Number)).sort((a, b) => parseFloat(b.Percet) - parseFloat(a.Percet));
        // console.log('check',check)
        // let Searchfinal = 'Dạ ok'


        // if (check.length > 0){
        let checkdata = datadkm.filter(p => p.Percet <= 100).sort((a, b) => parseFloat(a.Number) - parseFloat(b.Number)).sort((a, b) => parseFloat(b.Percet) - parseFloat(a.Percet));
        // console.log('292',checkdata.filter(p => p.ChatbotId === 292));
        console.log('datatop10', checkdata.slice(0, 10));
        let Searchfinal = checkdata.slice(0, 1)[0];
        console.log('Searchfinal', Searchfinal);
        //    }    
        // const Searchfinal = datadkm.reduce(function (prev, current) {
        //     return (prev.Percet > current.Percet) ? prev : current
        // })
        //returns object
        setHighestPercent(Searchfinal.Percet);
        setChatKH('')
        return Searchfinal
    }

    //kiem tra cu phap don hang
    const CheckWaybill = (waybill) => {
        let bill = "";
        waybill.forEach(element => { // lặp qua từng câu trong câu hỏi
            const CheckWaybillString = (element).slice(0, 2); //cắt 2 kí tự đầu
            const CheckWaybillNumber = (element).slice(2);    //cắt từ vị trí t3
            const CheckWaybillString3 = (element).slice(0, 3);//cắt từ vị trí t3
            const CheckWaybillNumber3 = (element).slice(3);//cắt từ vi trí t4
            const CheckWaybillString5 = (element).slice(0, 5);//cắt từ vị trí t5
            const CheckWaybillNumber5 = (element).slice(5);//cắt từ vi trí t5
            const CheckAllNumber = (element).slice(0);
            


            if (   // kiểm tra 2 kí đầu là chuỗi và các kí tự sau là chuỗi
                (
                    (typeof CheckWaybillString === 'string' && isNaN(CheckWaybillNumber) === false && CheckWaybillNumber !== '')

                    ||
                    // kiểm tra 3 kí đầu là chuỗi và các kí tự sau là chuỗi
                    (typeof CheckWaybillString3 === 'string' && isNaN(CheckWaybillNumber3) === false && CheckWaybillNumber3 !== '')

                    ||
                    (typeof CheckWaybillString5 === 'string' && isNaN(CheckWaybillNumber5) === false && CheckWaybillNumber5 !== '')
                    ||
                    (CheckWaybillString === 'VN' || CheckWaybillString === 'vn' || CheckWaybillString === 'Vn' || CheckWaybillString === 'vN')
                    ||

                    // kiểm tra tất cả là số
                    (isNaN(CheckAllNumber) === false && CheckAllNumber !== '' )
                )
                && element.length > 7
            ) {
                bill = element;
                return;
            }

        });
        return bill;
    }
    const [ChatKH, setChatKH] = useState();
    const [chatbottimer, setchatbottimer] = useState(null);
    const [Chatvalue, setChatvalue] = useState('');

    // xử lí câu hỏi (phân tích để lấy câu hỏi)
    const handleSearch = (event, text) => {
        //nối chuỗi câu hỏi
        setchatbottimer(window.clearTimeout(chatbottimer));
        if (event.key === 'Enter') {

            let min = 1;
            let max = 100;
            let id = parseInt(min + (Math.random() * (max - min)));
            let idbot = id + 1;

            const getChatKHAll = ChatKH === undefined ? text : ChatKH + ' ' + text;
            setChatKH(getChatKHAll);
            setChatvalue('');



            //kiểm tra câu hỏi và đẩy lên khung chat
            if (text !== undefined && text.trim() !== "") {

                const viewmsg = {
                    Key: "User",
                    Result: text,
                    Keys: Math.floor((Math.random() * 100) + 1)
                }

                const dataview = [...dataChat];
                dataview.push(viewmsg);
                setdataChat(dataview)
                Task_spChatbot_LogMessage_Save(28, 11, viewmsg.Result, 'IT', 'Bot')

                localStorage.setItem('idsend', id);
                localStorage.setItem('idbot', idbot);
            }

            //đặt thời gian để lấy chuỗi câu hỏi để phân tích

            setchatbottimer(window.setTimeout(() => {

                if (getChatKHAll !== undefined && getChatKHAll.trim() !== "") {

                    const viewmsg = {
                        Key: "User",
                        Result: getChatKHAll,
                        Keys: Math.floor((Math.random() * 100) + 1)
                    }
                    setQuestion(viewmsg);

                }
            }, 3000)
            )
        }



    }

    //List của chủ đề

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

    //List thực thể theo chủ đề

    const Task_spChatbotQuestion_ListBySubjectId = async () => {

        let pr = {
            KeySearch: txtSearch,
            SubjectId: SubjectId
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbotQuestion_ListBySubjectId",
            API_key: "netcoApikey2025"
        }

        const list = await callApi.Main(params);
        setdataAnswer(list);

    }

    const Task_spChatbot_LogMessage_GetNotify = async () => {

        let pr = {
            KeySearch: txtSearch,
            Id_ChatBot_log: 0
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbot_LogMessage_GetNotify",
            API_key: "netcoApikey2025"
        }

        const list = await callApi.Main(params);
        setdataChatList(list);


    }

    // lựa chọn chủ đề

    const onSelectTopic = (item) => {
        setSubjectId(item.value);
    }

    const Task_spChatbot_LogMessage_Save = async (idsend, idrecieve, dta, namesend, namerecieve, ChatbotId) => {


        let date = new Date();


        let groupid = 'Group' + '_' + 28 + '_' + 11
        let pr = {
            Id_ChatBot_log: 0,
            Id_Recieve: idrecieve,
            Name_Recieve: namerecieve,
            Id_Send: idsend,
            Name_Send: namesend,
            Message: dta,
            Status_Read: "false",
            Createtime: date,
            Email_Reacieve: 'yahooo@gmail.com',
            Phone_Recieve: '101536666',
            Group_Id: groupid,
            ChatbotId: ChatbotId,
            Type: 'Web'
        }

        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbot_LogMessage_Save",
            API_key: "netcoApikey2025"
        }

        const list = await callApi.Main(params);
        // AlertSuccess(list.Result);

    }

    const Task_spChatbot_LogMessage_GetDatalog = async (item) => {

        let pr = {
            Group_Id: item
        }
        const params = {
            Json: JSON.stringify(pr),
            func: "Task_spChatbot_LogMessage_GetDatalog",
            API_key: "netcoApikey2025"
        }
        const list = await callApi.Main(params);
        setdataLogbot(list)

    }
    //loại bỏ kí tự đặc biệt
    const removeAccents = (str) => {
        const data = str.toLowerCase()
            .replace(/ỏ/g, 'o') // bỏ hoa thường
            .normalize('NFD') // bỏ chữ có dâu
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
        return data;
    }
    //render phần tử trong datachat
    const parse = require('html-react-parser');
    const RenderMessage = () => {

        return (
            dataChat.map((item, index) => {
                if (item.Key === 'User') {
                    return (
                        <div class="chat message-user" key={index}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                                alt='emily'
                                href='#'
                                className='avatar-chat'
                            />
                            <p class="msg">
                                {item.Result}
                            </p>
                        </div>

                    )
                }
                else
                    return (
                        <div class="chat message-bot" key={index}>
                            <img
                                src="https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/1e/19/37/1e193710-35a7-7d05-a99e-c097d26cd9d2/AppIcon-1x_U007emarketing-0-5-0-85-220.png/1200x630wa.png"
                                alt='NetcoBot'
                                href='#'
                                className='avatar-chat'
                            />
                            <p class="msg">


                                {item.Key}  :  <br />
                                {parse(item.Result)}

                            </p>
                        </div>

                    )
            }
            )

        )
    }

    const RenderChatlog = () => {

        return (
            dataLogbot.map((item, index) => {
                upTop();
                let a = item.Name_Send.slice(-3)

                if (a === 'Bot') {
                    return (
                        <div class="chat message-bot" key={index}>
                            <img
                                src="https://is2-ssl.mzstatic.com/image/thumb/Purple114/v4/1e/19/37/1e193710-35a7-7d05-a99e-c097d26cd9d2/AppIcon-1x_U007emarketing-0-5-0-85-220.png/1200x630wa.png"
                                alt='NetcoBot'
                                href='#'
                                className='avatar-chat'
                            />
                            <p class="msg">

                                {item.Name_Send}  :  <br />
                                {parse(item.Message)}
                            </p>
                        </div>


                    )
                }
                else
                    return (
                        <div class="chat message-user" key={index}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                                alt='emily'
                                href='#'
                                className='avatar-chat'
                            />
                            <p class="msg">
                                {item.Name_Send}  :  <br />
                                {item.Message}</p>

                        </div>

                    )
            }
            )

        )
    }

    const RenderUser = () => {

        return (
            dataChatList.map((item, index) => {
                let a = item.Name_Send.slice(-3)

                if (a !== 'Bot') {

                    let text = '',
                        message = item.Message,
                        status = item.StatusRead;
                    let number = ' ';
                    if (message.length > 20 && message !== '') {
                        text = message.slice(0, 18) + '  ' + '...'
                    }
                    else {
                        text = message
                    }

                    if (status !== 0) {
                        number = status
                    }
                    return (
                        <li
                        >
                            <div class="customer-bar "
                                key={index}
                                id='customer'
                            >
                                <div class="col-sm-12 col-md-12 ">
                                    <div class='row'>
                                        <div class="col-sm-12 col-md-12 ">
                                            <div class='row'>
                                                <div class="col-sm-12 col-md-5 time">
                                                    {FormatDate(item.Createtime)}


                                                </div>
                                                <div class="col-sm-12 col-md-5 time"
                                                style={{marginLeft:'50px',fontStyle:'oblique'}}>
                                                    {item.Type}
                                                </div>

                                            </div>
                                        </div>
                                        <div class="col-sm-12 col-md-2 mt-2">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                                                alt='emily'
                                                href='#'
                                                className='avatar-chat'
                                            />
                                        </div>
                                        <div class="col-sm-12 col-md-8 ">
                                            <div class='row'>
                                                <div class="col-sm-12 col-md-12 ">
                                                    <p class='namekh'> {item.Name_Send}</p>
                                                </div>
                                                <div class="col-sm-12 col-md-12 ">

                                                    <div class='row'>
                                                        <div class="col-sm-12 col-md-8 ">
                                                            <p>{text}</p>
                                                        </div>
                                                        <div class="col-sm-12 col-md-2 ">
                                                            <p style={{ color: 'red' }}>{number}</p>
                                                        </div>
                                                        <div class="col-sm-12 col-md-2 ">
                                                            <button class='btn btn-sm btn-success btn-xs btn-edit'
                                                                onClick={() => Task_spChatbot_LogMessage_GetDatalog(item.Group_Id)}
                                                            ><Eye
                                                                    size="18"
                                                                    color="white"
                                                                /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>)
                }
            }
            )

        )
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
                        >
                            Chat với ChatBot
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
                            Chatbot History (Lịch sử Chatbot)
                        </a>
                    </li>

                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div class="card  m-3" >
                            <div class="card-header bg-success p-0  ">
                                <div class="row h-100 d-flex align-items-center">
                                    <div class="col-8 col-md-6" >
                                        <h3 class="card-title m-0 pl-2 font-weight-bold text-light">
                                            BOT TEST
                                        </h3>
                                    </div>
                                    <div class="col-8 col-md-6" >
                                        <h3 class="card-title m-0 pl-2 font-weight-bold text-light">
                                            <p style={{ marginLeft: '500px' }}>
                                                Exact : {parseInt(HighestPercent)} %</p>
                                        </h3>
                                    </div>

                                </div>
                            </div>
                            <div class="card-body p-0 boxcolor">
                                <div className='message-box chatbox'>
                                    <RenderMessage />
                                    <div id={'el'} ref={back}></div>
                                </div>


                            </div>
                            <div className="card-footer bg-transparent border-0">
                                <div class='row'>
                                    <div class='col-sm-12 col-md-4 '>
                                        <SelectTopic
                                            onSelected={e => onSelectTopic(e)}
                                            onTopic={SubjectId}
                                        />
                                    </div>

                                    <div class='col-sm-12 col-md-8 custom-input'>
                                        <input
                                            id='ad'
                                            type='text'
                                            value={Chatvalue}
                                            placeholder=' Send a message ....'
                                            style={{ color: 'green' }}
                                            onChange={(e) => setChatvalue(e.target.value)}
                                            onKeyPress={(e) => handleSearch(e, e.target.value)}
                                            className='form-control input-send'
                                        />
                                        <button type="submit" class="chat-submit"
                                            onClick={handleSearch}>
                                            <Send
                                                size="22"
                                                color="#1bbb7b"
                                            /></button>
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
                                        <h3 class="card-title m-0 pl-2 font-weight-bold">Lịch sử Chat </h3>

                                    </div>

                                </div>
                            </div>
                            <div class="card-body p-2 chatlog">
                                <div className="row  mt-2">
                                    <div class="col-sm-12 col-md-4 messagelog-box">
                                        <ul class='minion'>
                                            < RenderUser />
                                        </ul>
                                    </div>


                                    <div className="col-md-8 mt-3 ">
                                        <div class="card-body p-0 boxcolor">
                                            <div className='messagelog-box chatlogbox'>
                                                <RenderChatlog />

                                            </div>
                                        </div>
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
export default TestBot;
