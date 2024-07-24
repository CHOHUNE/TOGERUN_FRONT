import SideOpenDrawer from "../component/common/sideOpenDrawer";
import {useNavigate} from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin";
import ResultModal from "../component/common/ResultModal";
import React, {useCallback, useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useRecoilState} from "recoil";
import {initState, signInState} from "../atoms/singinState";
import useEventSource from "../hooks/useEventSource";


const BasicMenu = () => {
    const queryClient = useQueryClient;
    const navigate = useNavigate();
    const { loginState } = useCustomLogin();
    const { doLogout, moveToPath } = useCustomLogin();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [signIn, setSignIn] = useRecoilState(signInState);

    const [lastEventId, setLastEventId] = useState(null);

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

    const handleNewEvent = useCallback((event) => {
        const data = JSON.parse(event.data);
        console.log('New event:', data);
        // 새로운 이벤트 처리 로직 추가
        setLastEventId(event.lastEventId); // 마지막 이벤트 ID 저장
    }, []);

    const handleError = useCallback((error) => {
        console.error('EventSource error:', error);
    }, []);

    // EventSource 구독
    useEventSource(
        'http://localhost:8080/api/notifications/subscribe',
        handleNewEvent,
        handleError,
        lastEventId
        , []); // 빈 의존성 배열 추가

    return (
        <div className="navbar bg-base-100 px-7">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h8m-8 6h16"/>
                        </svg>
                    </div>
                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a href={"/"}>Main</a>
                        </li>
                        <li>
                            <a>Parent</a>
                            <ul className="p-2">
                                <li>
                                    <a href={"/post/"}>Post</a>
                                </li>
                                <li>
                                    <a href={"/about"}>About</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a>Item 3</a>
                        </li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <a href={"/"}>Main</a>
                    </li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2">
                                <li>
                                    <a href={"/post/"}>Post</a>
                                </li>
                                <li>
                                    <a href={"/about/"}>About</a>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <a href={"/list"}>List</a>
                    </li>
                </ul>
            </div>

            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </button>
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                        </svg>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>
            </div>
            <div className={"join space-x-12"}>
                <SideOpenDrawer/>
                {!loginState.email ?
                    <button className={"btn join-item"} onClick={() => navigate("/member/login")}>Login</button>
                    :
                    <button className={"btn join-item"} onClick={toggleLogoutModal}>Logout</button>
                }
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


    )
}

export default BasicMenu;