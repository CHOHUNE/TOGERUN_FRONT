import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMember, deleteMember, restoreMember } from "../../api/memberAPI";
import { UserCircleIcon, TrashIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { UsersIcon } from "@heroicons/react/16/solid";
import CustomModal from './CustomModal';

const AdminComponent = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [modalConfig, setModalConfig] = useState({ show: false, title: '', content: '', onConfirm: null });
    const usersPerPage = 10;

    const { data: users, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: getAllMember
    });

    const softDeleteMutation = useMutation({
        mutationFn: deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const restoreMutation = useMutation({
        mutationFn: restoreMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const handleSoftDelete = (userId) => {
        setModalConfig({
            show: true,
            title: '사용자 삭제',
            content: '정말로 이 사용자를 삭제하시겠습니까?',
            onConfirm: () => {
                softDeleteMutation.mutate(userId);
                setModalConfig({ show: false });
            }
        });
    };

    const handleRestore = (userId) => {
        setModalConfig({
            show: true,
            title: '사용자 복구',
            content: '이 사용자를 복구하시겠습니까?',
            onConfirm: () => {
                restoreMutation.mutate(userId);
                setModalConfig({ show: false });
            }
        });
    };

    const closeModal = () => setModalConfig({ show: false });

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    if (isError) return (
        <div className="flex justify-center items-center h-screen">
            <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>오류! 사용자 정보를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.</span>
            </div>
        </div>
    );

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const renderUserCard = (user) => (
        <div key={user.id} className="card bg-base-100 shadow-xl mb-4">
            <div className="card-body p-4">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            {user.img ? (
                                <img src={user.img} alt={user.name} />
                            ) : (
                                <UserCircleIcon className="w-12 h-12 text-gray-300" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="card-title text-lg truncate">{user.name}</h2>
                        <p className="text-sm opacity-50 truncate">{user.nickname}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm mb-2">
                    <div>
                        <p className="font-semibold">연락처:</p>
                        <p className="truncate">{user.email}</p>
                        <p>{user.mobile}</p>
                    </div>
                    <div>
                        <p className="font-semibold">상세 정보:</p>
                        <p>{user.gender}, {user.age}세</p>
                        <span className={`badge ${user.social ? 'badge-info' : 'badge-success'} badge-sm`}>
                            {user.social ? '소셜' : '일반'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
                    <span className={`badge ${user.deleted ? 'badge-error' : 'badge-success'}`}>
                        {user.deleted ? '삭제됨' : '활성'}
                    </span>
                    {user.deleted ? (
                        <button
                            onClick={() => handleRestore(user.id)}
                            className="btn btn-ghost btn-sm"
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            복구
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSoftDelete(user.id)}
                            className="btn btn-ghost btn-sm text-error"
                        >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            삭제
                        </button>
                    )}
                </div>
                {user.deleted && (
                    <div className="text-xs opacity-50 mt-2 truncate">
                        삭제일: {new Date(user.deletedAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <UsersIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white mr-3 sm:mr-4" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">관리자 대시보드</h1>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 sm:px-4 sm:py-2">
                        <span className="text-white font-semibold text-sm sm:text-base">사용자 관리</span>
                    </div>
                </div>
                <p className="text-white mt-2 opacity-80 text-sm sm:text-base">전체 사용자: {users ? users.length : 0}명</p>
            </div>

            {/* PC 환경의 테이블 뷰 */}
            <div className="hidden md:block overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>사용자</th>
                        <th>연락처</th>
                        <th>상세 정보</th>
                        <th>상태</th>
                        <th>작업</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <div className="flex items-center space-x-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            {user.img ? (
                                                <img src={user.img} alt={user.name} />
                                            ) : (
                                                <UserCircleIcon className="w-12 h-12 text-gray-300" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{user.name}</div>
                                        <div className="text-sm opacity-50">{user.nickname}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {user.email}
                                <br/>
                                <span className="badge badge-ghost badge-sm">{user.mobile}</span>
                            </td>
                            <td>
                                {user.gender}, {user.age}세
                                <br/>
                                <span className={`badge ${user.social ? 'badge-info' : 'badge-success'} badge-sm`}>
                                        {user.social ? '소셜' : '일반'}
                                    </span>
                            </td>
                            <td>
                                    <span className={`badge ${user.deleted ? 'badge-error' : 'badge-success'}`}>
                                        {user.deleted ? '삭제됨' : '활성'}
                                    </span>
                                {user.deleted && (
                                    <div className="text-xs opacity-50">
                                        삭제일: {new Date(user.deletedAt).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                    </div>
                                )}
                            </td>
                            <td>
                                {user.deleted ? (
                                    <button
                                        onClick={() => handleRestore(user.id)}
                                        className="btn btn-ghost btn-xs"
                                    >
                                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                                        복구
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSoftDelete(user.id)}
                                        className="btn btn-ghost btn-xs text-error"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-1" />
                                        삭제
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 모바일 환경의 카드 뷰 */}
            <div className="md:hidden">
                {currentUsers.map(renderUserCard)}
            </div>

            <div className="flex justify-center mt-6">
                <div className="join">
                    <button
                        className="join-item btn btn-sm sm:btn-md"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`join-item btn btn-sm sm:btn-md ${currentPage === i + 1 ? 'btn-active' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="join-item btn btn-sm sm:btn-md"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>

            {modalConfig.show && (
                <CustomModal
                    title={modalConfig.title}
                    content={modalConfig.content}
                    onClose={closeModal}
                    onConfirm={modalConfig.onConfirm}
                />
            )}
        </div>
    );
};

export default AdminComponent;