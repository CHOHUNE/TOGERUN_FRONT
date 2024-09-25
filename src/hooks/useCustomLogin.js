import React from 'react';
import {Navigate, useNavigate} from "react-router-dom";
import {useRecoilState, useResetRecoilState} from "recoil";
import {signInState} from "../atoms/singinState";
import {loginPost} from "../api/memberAPI";
import {removeCookie, setCookie} from "../util/cookieUtil";
import axios from "axios";

function UseCustomLogin(props) {

    //deprecated
    // const loginState = useSelector(state=>state.loginSlice);
    // const dispatch = useDispatch();

    const [loginState,setLoginState] = useRecoilState(signInState);
    const resetState = useResetRecoilState(signInState);
    const isLogin =!!loginState.email;
    const navigate = useNavigate();

    const doLogin = async (loginParam) => {

        // deprecated
        // const action = await dispatch(loginPostAsync(loginParam))
        // return action.payload

        const result = await loginPost(loginParam);

            saveAsCookie(result)

        console.log("result{}",result)
        console.log("result.email{}",result.email)

        return result;
    };

    const doLogout=async()=>{
        // dispatch(logout())

        // nai('/api/member/logout')

        removeCookie('member')
        // removeCookie('JSESSIONID')
        resetState();


    }

    const saveAsCookie=(data)=>{
        setCookie('member',JSON.stringify(data),1)
        setLoginState(data)
    }

    const moveToLogin =(path)=>{
        navigate({pathname:'/member/login'},{replace: true})
    } //replace : true 를 하면 이전 페이지로 돌아갈 수 없다.

    const moveToLoginReturn =()=>{
        return <Navigate replace to = {"/member/login"}/>
    }

    const moveToPath=(path)=>{
        navigate({pathname:path},{replace:true})
    }


    return {loginState,isLogin,doLogin,doLogout,moveToPath,moveToLogin,moveToLoginReturn,saveAsCookie}
}

export default UseCustomLogin;