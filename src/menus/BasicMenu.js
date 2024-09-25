import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin";
import { useMutation } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { initState, signInState } from "../atoms/singinState";
import NotificationIcon from "../component/notification/NotificationComponent";
import { Bars3Icon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import SideOpenDrawer from "../component/common/sideOpenDrawer";
import ResultModal from "../component/common/ResultModal";

const BasicMenu = () => {
    const navigate = useNavigate();
    const { doLogout, moveToPath, loginState } = useCustomLogin();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [signIn, setSignIn] = useRecoilState(signInState);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchKeyword && searchKeyword.trim() !== "") {
            navigate(`/post/list?keyword=${encodeURIComponent(searchKeyword.trim())}`);
        }
    }

    const logoutMutation = useMutation({
        mutationFn: () => doLogout(),
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
    const toggleSideDrawer = () => setIsSideDrawerOpen(!isSideDrawerOpen);

    return (
        <div className="bg-base-100">
            <div className="navbar container mx-auto px-8 sm:px-13 lg:px-16">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <Bars3Icon className="h-5 w-5"/>
                        </label>
                        <ul tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <a href="/post/list">Post</a>
                            </li>
                            {loginState.email && (
                                <li>
                                    <a href="/member/modify">My Profile</a>
                                </li>
                            )}
                        </ul>
                    </div>
                    <a className="btn btn-ghost normal-case text-xl">RunTogether</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <a href="/post/list">Post</a>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <form onSubmit={handleSearch} className="flex items-center">
                        <input
                            type="text"
                            placeholder="제목,내용,장소 검색"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="input input-bordered w-full max-w-xs"
                        />
                        <button type="submit" className="btn btn-ghost btn-circle ml-2">
                            <MagnifyingGlassIcon className="h-5 w-5"/>
                        </button>
                    </form>
                    <NotificationIcon/>
                    <button onClick={toggleSideDrawer} className="btn btn-ghost btn-circle ml-2">
                        Chat
                    </button>
                    {loginState.email && (
                        <a href="/member/modify" className="btn btn-ghost btn-circle ml-2">
                            {loginState.img ? (
                                <img src={loginState.img} alt="Profile" className="w-8 h-8 rounded-full" />
                            ) : (
                                <UserCircleIcon className="h-8 w-8" />
                            )}
                        </a>
                    )}
                    {!loginState.email ?
                        <button className="btn" onClick={() => navigate("/member/login")}>Login</button>
                        :
                        <button className="btn" onClick={toggleLogoutModal}>Logout</button>
                    }
                </div>
            </div>

            <SideOpenDrawer isOpen={isSideDrawerOpen} onClose={toggleSideDrawer} />

            {showLogoutModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">로그아웃 하시겠습니까?</h3>
                        <div className="modal-action py-5">
                            <button className="btn btn-outline btn-error" onClick={handleClickLogout}>Yes</button>
                            <button className="btn btn-outline btn-neutral" onClick={toggleLogoutModal}>No</button>
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                    onClick={toggleLogoutModal}>✕
                            </button>
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