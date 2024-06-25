import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";

const initState = {
    email: '',
    pw: ''
}

const LoginComponent = () => {

    const [loginParam, setLoginParam] = useState({...initState})



    const {doLogin,moveToPath} = useCustomLogin();
    // const dispatch = useDispatch();

    const handleChange = (e) => {
        loginParam[e.target.name] = e.target.value
        setLoginParam({...loginParam})
    }

    const handleClickLogin = (e) => {
        e.preventDefault();
        doLogin(loginParam).then(response => {
            if (!response.error) {
                moveToPath('/')

            }
        })

    }

    return (
        <div className="card shrink-0 w-full max-w-2xl shadow-2xl bg-base-100">
            <form className="card-body">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input name={"email"} type="text" value={loginParam.email} onChange={handleChange}
                           placeholder="email" className="input input-bordered" required/>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input name={"pw"} type="password" value={loginParam.pw} onChange={handleChange}
                           placeholder="password" className="input input-bordered" required/>
                </div>
                <div className="flex justify-end my-4 ">
                    <a href="#" className="label-text-alt link link-hover mr-4">회원가입</a>
                    <a href="#" className="label-text-alt link link-hover">비밀번호 찾기</a>
                </div>
                <div className="form-control">
                    <button className="btn btn-primary" onClick={handleClickLogin}>로그인</button>
                </div>
                <KakaoLoginComponent/>
            </form>

        </div>
    );
};

export default LoginComponent;