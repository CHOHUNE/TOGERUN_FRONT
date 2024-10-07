import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin";
import {useMutation} from "@tanstack/react-query";
import {useRecoilState} from "recoil";
import {initState, signInState} from "../atoms/singinState";
import NotificationIcon from "../component/notification/NotificationComponent";
import {Bars3Icon, MagnifyingGlassIcon, UserCircleIcon, ChatBubbleLeftRightIcon} from '@heroicons/react/24/outline';
import SideOpenDrawer from "../component/common/sideOpenDrawer";
import ResultModal from "../component/common/ResultModal";


const BasicMenu = () => {
    const navigate = useNavigate();
    const {doLogout, moveToPath, loginState} = useCustomLogin();
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
        <div className="bg-base-100 shadow-md relative z-50">
            <div className="navbar container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <Bars3Icon className="h-5 w-5"/>
                        </label>
                        <ul tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <button onClick={() => navigate('/post/list')}>게시글</button>
                            </li>
                            {loginState.roleNames && loginState.roleNames.includes("ADMIN") && (
                                <li>
                                    <button onClick={() => navigate("/member/admin")}>관리자</button>
                                </li>
                            )}
                            {loginState.email && (
                                <li>
                                    <button onClick={() => navigate("/member/modify")}>내 프로필</button>
                                </li>
                            )}
                        </ul>
                    </div>

                    <button onClick={() => navigate('/home')} className="btn btn-ghost normal-case px-2 h-auto min-h-0">
                        <div className="h-12 sm:h-16 w-auto py-1"> {/* 작은 화면에서는 h-12, 큰 화면에서는 h-16 */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" className="h-full w-auto">
                                <defs>
                                    <style>
                                        @import
                                        url('https://fonts.googleapis.com/css2?family=Futura:wght@400&display=swap');
                                    </style>
                                </defs>
                                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="100"
                                      fontWeight="400" fill="currentColor" fontFamily="Futura, sans-serif">TOGERUN
                                </text>
                            </svg>
                        </div>
                    </button>

                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {loginState.roleNames && loginState.roleNames.includes("ADMIN") && (
                            <li>
                                <button onClick={() => navigate("/member/admin")}>관리자</button>
                            </li>
                        )}
                        <li>
                            <button onClick={() => navigate('/post/list')}>게시글</button>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <form onSubmit={handleSearch} className="flex items-center">
                        <div className="form-control">
                            <input
                                type="text"
                                placeholder="제목, 내용, 장소 검색"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="input input-bordered w-24 md:w-auto"
                            />
                        </div>
                        <button type="submit" className="btn btn-ghost btn-circle">
                            <MagnifyingGlassIcon className="h-5 w-5"/>
                        </button>
                    </form>
                    <NotificationIcon/>
                    <button onClick={toggleSideDrawer} className="btn btn-ghost btn-circle">
                        <ChatBubbleLeftRightIcon className="h-5 w-5"/>
                    </button>
                    {loginState.email && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    {loginState.img ? (
                                        <img src={loginState.img} alt="프로필"/>
                                    ) : (
                                        <UserCircleIcon className="h-10 w-10"/>
                                    )}
                                </div>
                            </label>
                            <ul tabIndex={0}
                                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li>
                                    <button onClick={() => navigate('/member/modify')}>프로필</button>
                                </li>
                                <li>
                                    <button onClick={() => navigate('/member/favorites')}>즐겨 찾기</button>
                                </li>
                                <li>
                                    <button onClick={toggleLogoutModal}>로그아웃</button>
                                </li>
                            </ul>
                        </div>
                    )}
                    {!loginState.email && (
                        <button className="btn btn-primary" onClick={() => navigate("/member/login")}>로그인</button>
                    )}
                </div>
            </div>

            <SideOpenDrawer isOpen={isSideDrawerOpen} onClose={toggleSideDrawer}/>

            {showLogoutModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">로그아웃 하시겠습니까?</h3>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleClickLogout}>예</button>
                            <button className="btn btn-ghost" onClick={toggleLogoutModal}>아니오</button>
                        </div>
                    </div>
                </div>
            )}

            {logoutMutation.isSuccess && (
                <ResultModal
                    title={'로그아웃'}
                    content={'로그아웃이 완료되었습니다.'}
                    callbackFn={closeModal}
                />
            )}
        </div>
    );
};

export default BasicMenu;