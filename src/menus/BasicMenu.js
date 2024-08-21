import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { initState, signInState } from "../atoms/singinState";
import NotificationIcon from "../component/notification/NotificationComponent";
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SideOpenDrawer from "../component/common/sideOpenDrawer";
import ResultModal from "../component/common/ResultModal";

const BasicMenu = () => {
    const queryClient = useQueryClient;
    const navigate = useNavigate();

    const { doLogout, moveToPath,loginState } = useCustomLogin();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [signIn, setSignIn] = useRecoilState(signInState);


    const logoutMutation = useMutation(
        { mutationFn: () => doLogout(),
            onSuccess: () => {
                setSignIn(initState);
            }
        });

    function handleClickLogout() {
        logoutMutation.mutate();
        toggleLogoutModal();
    }

    const closeModal = () => {
        if (logoutMutation.isSuccess) {
            moveToPath('/');
        }
    }

    const toggleLogoutModal = () => setShowLogoutModal(!showLogoutModal);



    return (
        <div className="bg-base-100">
            <div className="navbar container mx-auto px-8 sm:px-13 lg:px-16">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <Bars3Icon className="h-5 w-5" />
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {/*<li><a href="/">Main</a></li>*/}
                            <li><a href="/post/list">Post</a></li>
                            <li><a href="/member/modify">memberInfo</a></li>
                            {/*<li><a href="/list">List</a></li>*/}
                        </ul>
                    </div>
                    <a className="btn btn-ghost normal-case text-xl">RunTogether</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {/*<li>    <a href="/">Main</a></li>*/}
                        <li><a href="/post/list">Post</a></li>
                        <li><a href="/member/modify">memberInfo</a></li>
                        {/*<li><a href="/list">List</a></li>*/}
                    </ul>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-ghost btn-circle">
                        <MagnifyingGlassIcon className="h-5 w-5"/>
                    </button>
                    <NotificationIcon/>
                    <div className="mr-2">
                        <SideOpenDrawer/>
                    </div>
                    {!loginState.email ?
                        <button className="btn" onClick={() => navigate("/member/login")}>Login</button>
                        :
                        <button className="btn" onClick={toggleLogoutModal}>Logout</button>
                    }
                </div>

        </div>

    {showLogoutModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">로그아웃 하시겠습니까?</h3>
                        <div className="modal-action py-5">
                            <button className="btn btn-outline btn-error" onClick={handleClickLogout}>Yes</button>
                            <button className="btn btn-outline btn-neutral" onClick={toggleLogoutModal}>No</button>
                            <button  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggleLogoutModal}>✕</button>
                        </div>
                    </div>
                </div>
            )}
            {logoutMutation.isSuccess ?
                <ResultModal title={'로그아웃'} content={`로그아웃이 완료 되었습니다.`}
                             callbackFn={closeModal}/> : <></>}

        </div>
    );
};

export default BasicMenu;