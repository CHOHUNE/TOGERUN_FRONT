import React from 'react';
import {Navigate, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {loginPostAsync, logout} from "../slice/loginSlice";

function UseCustomLogin(props) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginState = useSelector(state=>state.loginSlice);

    const isLogin =!!loginState.email;

    const doLogin = async (loginParam) => {



        const action = await dispatch(loginPostAsync(loginParam))


        return action.payload


    };

    const doLogout=()=>{
        dispatch(logout());
    }

    const moveToLogin =(path)=>{
        navigate({pathname:'/member/login'},{replace: true})
    }

    const moveToLoginReturn =()=>{
        return <Navigate replace to = {"/member/login"}/>
    }

    const moveToPath=(path)=>{
        navigate({pathname:path},{replace:true})
    }


    return {loginState,isLogin,doLogin,doLogout,moveToPath,moveToLogin,moveToLoginReturn}
}

export default UseCustomLogin;