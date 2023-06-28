import { ArrowRight } from 'iconsax-react'
import React, { useRef, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { ToastErrorRight, ToastSuccessRight,  ToastWarningRight, SelectPost } from '../common'
import { accounts } from '../descriptors/account'
import { useOfficers } from '../hooks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Brand from '../img/logo.png'
import { callApi } from '../services'
import { setPostLocation, setPostName, setRole, set_isAuth } from '../store'

const Login = () => {
    const [state, dispatch] = useOfficers()
    const [PostId, setPostId] = useState(0);
    const [UserName, setUserName] = useState('');
    const UserNameRef = useRef(null);
    const [Password, setPassword] = useState('');
    const PassWordRef = useRef(null);
    const [token, setToken] = useLocalStorage('token', '');
    const [isAuth, setIsAuth] = useLocalStorage('isAuth', false);
    const [roleLocal, setRoleLocal] = useLocalStorage('role', 'user');
    const [postIdLocal, setPostIdLocal] = useLocalStorage('postLocation', 0);
    const [postNameLocal, setPostNameLocal] = useLocalStorage('postName', '');
    const [postLogin, setPostLogin] = useLocalStorage('postLogin', 0);

    // useEffect(() => {
    //     const listener = async event => {
    //         if (event.code === "Enter" || event.code === "NumpadEnter") {
    //             event.preventDefault();
    //             await CPN_spTimeKeeping_Login();
    //             // document.querySelector('.close').click();
    //             // callMyFunction();
    //         }
    //     };
    //     document.addEventListener("keydown", listener);
    //     return () => {
    //         document.removeEventListener("keydown", listener);
    //     };
    // }, [PostId, UserName, Password]);

    const randToken = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const CPN_spTimeKeeping_Login = async () => {
        let tokenLocal = JSON.parse(localStorage.getItem('token'));
        const genToken = randToken();

        if (UserName.trim() === '') {
            ToastWarningRight('Vui lòng nhập tên đăng nhập');
            UserNameRef.current.focus();
            return;
        }
        if (Password.trim() === '') {
            ToastWarningRight('Vui lòng nhập Mật khẩu');
            PassWordRef.current.focus();
            return;
        }


        if (accounts[0].UserName === UserName) {
            dispatch(setRole('itvip'))
            setRoleLocal('itvip')
            setPostIdLocal(128)
            setPostLogin(128)
            dispatch(setPostLocation(128))
            ToastSuccessRight('Đăng nhập thành công');
            setIsAuth(true)
            dispatch(set_isAuth(true))
            reset()
            document.querySelector('.close-login').click();
            return;
        }

        if (accounts[2].UserName === UserName) {
            dispatch(setRole('deployment'))
            setRoleLocal('deployment')
            setPostIdLocal(128)
            setPostLogin(128)
            dispatch(setPostLocation(128))
            ToastSuccessRight('Đăng nhập thành công');
            setIsAuth(true)
            dispatch(set_isAuth(true))
            reset()
            document.querySelector('.close-login').click();
            return;
        }

        if (PostId === 0) {
            ToastWarningRight('Vui lòng chọn bưu cục');
            return;
        }
        let check = []
        accounts.forEach(element => {
            if (element.UserName === UserName && element.Password === Password) {
                check.push(element)
            }
        })

        if (check.length === 0) {
            ToastErrorRight('Tên đăng nhập hoặc mật khẩu không đúng');
            return;
        }


        try {
            const pr = {
                Json: JSON.stringify({
                    PostId: PostId,
                    Token: !tokenLocal || tokenLocal.length === 0 ? genToken : tokenLocal,
                }),
                func: "CPN_spTimeKeeping_Login",
                API_key: "netcoApikey2025"
            }
          
            const res = await callApi.Main(pr);

            if (res.Status === 'OK') {
                if(!tokenLocal || tokenLocal.length === 0){
                    setToken(genToken)
                }
                ToastSuccessRight('Đăng nhập thành công');
                document.querySelector('.close-login').click();
                setIsAuth(true)
                dispatch(set_isAuth(true))
                reset()
               
                    dispatch(setRole('user'))
                    setRoleLocal('user')
                
                return;
            }
            if (res?.data === '') {
                ToastErrorRight('Tài khoản đã đăng nhập trên thiết bị khác');
                setIsAuth(false)
                return;
            }
            if (res.length > 0) {
                ToastSuccessRight('Đăng nhập thành công');
                document.querySelector('.close-login').click();
                setIsAuth(true)
                dispatch(set_isAuth(true))
                reset()
          
                    dispatch(setRole('user'))
                    setRoleLocal('user')
                return;
            }
            if (res.Status === 'NOTOK') {
                ToastErrorRight(res.ReturnMess);
                setIsAuth(false)
                
                return;
            }

        } catch (error) {
            console.log(error);
            ToastErrorRight('Có lỗi xảy ra, vui lòng liên hệ với bộ phận IT!')
        }
    }

    const reset = () => {
        setPassword('');
        setUserName('');
        setPostId(0);

    }

    const handleChangePost = (e) => {

        if (e.value !== 0) {
            setPostId(e.value);
            setPostNameLocal(e.label)
            setPostIdLocal(e.value)
            setPostLogin(e.value)
            dispatch(setPostLocation(e.value))
            setPostNameLocal(e.label)
            dispatch(setPostName(e.label))
        }
    }


    return (
        <div
            class="modal fade"
            id="loginModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            data-backdrop="static"
            data-keyboard="false"
        >
            <div class="modal-dialog" role="document">
                <div class="modal-content modal-login p-3">
                    <div class="modal-header border-bottom-0 position-relative">
                        <div className="d-flex flex-column align-items-center justify-content-center w-100 ">
                            <img src={Brand} alt="" width={200} height={'auto'} className='mt-3' />
                            <h4 class="modal-title mt-3 title-login" id="exampleModalLabel">Đăng nhập</h4>

                        </div>
                        <button
                            type="button"
                            class="close-login position-absolute btn-close d-none"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-style">
                            <form >
                                <div class="form-group pb-3">
                                    <input
                                        type="text"
                                        placeholder="Tên đăng nhập"
                                        class="form-control input-login"
                                        aria-describedby="emailHelp"
                                        value={UserName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        ref={UserNameRef}
                                    />
                                </div>
                                <div class="form-group pb-3">
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu"
                                        class="form-control input-login"
                                        value={Password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        ref={PassWordRef}
                                    />
                                </div>
                                <div class="form-group ">
                                    <div class="input-group">
                                        <SelectPost
                                            AreaId={0}
                                            onSelected={e => handleChangePost(e)}
                                            onPost={PostId}
                                            isNewStyle={true}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    class="btn btn-success w-100 font-weight-bold mt-2 py-3 mb-3 mt-3"
                                    onClick={CPN_spTimeKeeping_Login}
                                >
                                    Đăng nhập
                                    <ArrowRight size="25" color="#fff" className='float-right' />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login);