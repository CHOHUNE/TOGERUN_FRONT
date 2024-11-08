import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useCustomLogin from "../hooks/useCustomLogin";
import { useMutation } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { initState, signInState } from "../atoms/singinState";
import NotificationIcon from "../component/notification/NotificationComponent";
import { Bars3Icon, MagnifyingGlassIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import SideOpenDrawer from "../component/common/sideOpenDrawer";
import ResultModal from "../component/common/ResultModal";
import { ClipboardDocumentListIcon, ShieldCheckIcon } from "@heroicons/react/16/solid";

const BasicMenu = () => {
    const navigate = useNavigate();
    const { doLogout, moveToPath, loginState, isLogin } = useCustomLogin();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [signIn, setSignIn] = useRecoilState(signInState);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    const toggleSearchVisibility = () => setIsSearchVisible(!isSearchVisible);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="bg-base-100 shadow-md relative z-50">
            <div className="navbar container mx-auto px-2 sm:px-4 lg:px-8">
                <div className="navbar-start">
                    <button onClick={toggleMobileMenu} className="btn btn-ghost lg:hidden">
                        <Bars3Icon className="h-5 w-5"/>
                    </button>
                    <div className="flex items-center h-16"> {/* Fixed height container */}
                        <img
                            src="https://myprojectsbuckets.s3.ap-northeast-2.amazonaws.com/chatApp/home/togerun_big.png"
                            alt="TOGERUN"
                            className="h-8 w-auto object-contain" /* Adjusted height and added object-contain */
                        />
                    </div>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 space-x-2">
                        {loginState.roleNames && loginState.roleNames.includes("ROLE_ADMIN") && (
                            <li>
                                <button
                                    onClick={() => navigate("/member/admin")}
                                    className="btn btn-sm btn-outline hover:btn-primary transition-colors duration-300 flex items-center space-x-2 group"
                                >
                                    <ShieldCheckIcon className="h-5 w-5 group-hover:opacity-100"/>
                                    <span>관리자</span>
                                </button>
                            </li>
                        )}
                        {isLogin && (
                            <li>
                                <button
                                    onClick={() => navigate('/post/list')}
                                    className="btn btn-sm btn-outline hover:btn-secondary transition-colors duration-300 flex items-center space-x-2 group"
                                >
                                    <ClipboardDocumentListIcon className="h-5 w-5 group-hover:opacity-100"/>
                                    <span>게시글</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="navbar-end">
                    {isLogin && (
                        <>
                            {/* PC 환경 검색창 */}
                            <div className="hidden lg:block mr-2">
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="제목, 내용, 장소 검색"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                        className="input input-bordered w-full max-w-xs"
                                    />
                                    <button type="submit" className="btn btn-ghost btn-circle ml-2">
                                        <MagnifyingGlassIcon className="h-5 w-5"/>
                                    </button>
                                </form>
                            </div>
                            {/* 모바일 검색 버튼 */}
                            <button onClick={toggleSearchVisibility} className="btn btn-ghost btn-circle lg:hidden">
                                <MagnifyingGlassIcon className="h-5 w-5"/>
                            </button>
                            <NotificationIcon/>
                            <button onClick={toggleSideDrawer} className="btn btn-ghost btn-circle">
                                <ChatBubbleLeftRightIcon className="h-5 w-5"/>
                            </button>
                        </>
                    )}
                    {loginState.email ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-8 rounded-full">
                                    {loginState.img ? (
                                        <img src={loginState.img} alt="프로필"/>
                                    ) : (
                                        <UserCircleIcon className="h-8 w-8"/>
                                    )}
                                </div>
                            </label>
                            <ul tabIndex={0}
                                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li><button onClick={() => navigate('/member/modify')}>프로필</button></li>
                                <li><button onClick={() => navigate('/member/favorites')}>즐겨 찾기</button></li>
                                <li><button onClick={toggleLogoutModal}>로그아웃</button></li>
                            </ul>
                        </div>
                    ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => navigate("/member/login")}>로그인</button>
                    )}
                </div>
            </div>

            {/* 모바일 메뉴 */}
            <div className={`lg:hidden bg-base-100 shadow-md overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
                <ul className="menu menu-sm p-2">
                    {isLogin && <li><button onClick={() => navigate('/post/list')}>게시글</button></li>}
                    {loginState.roleNames && loginState.roleNames.includes("ROLE_ADMIN") && (
                        <li><button onClick={() => navigate("/member/admin")}>관리자</button></li>
                    )}
                    {isLogin && <li><button onClick={() => navigate("/member/modify")}>내 프로필</button></li>}
                </ul>
            </div>

            {/* 모바일 검색 */}
            <div className={`lg:hidden bg-base-100 overflow-hidden transition-all duration-300 ease-in-out ${isSearchVisible ? 'max-h-20' : 'max-h-0'}`}>
                <div className="p-2">
                    <form onSubmit={handleSearch} className="flex items-center">
                        <input
                            type="text"
                            placeholder="제목, 내용, 장소 검색"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="input input-bordered w-full mr-2"
                        />
                        <button type="submit" className="btn btn-ghost btn-circle">
                            <MagnifyingGlassIcon className="h-5 w-5"/>
                        </button>
                    </form>
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

            <style jsx>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .notification-dropdown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default BasicMenu;