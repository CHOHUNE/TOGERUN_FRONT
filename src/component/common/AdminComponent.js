import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMember, deleteMember, restoreMember } from "../../api/memberAPI";
import { UserCircleIcon, TrashIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const AdminComponent = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
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
        if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            softDeleteMutation.mutate(userId);
        }
    };

    const handleRestore = (userId) => {
        if (window.confirm('이 사용자를 복구하시겠습니까?')) {
            restoreMutation.mutate(userId);
        }
    };

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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">관리자 대시보드 - 사용자 관리</h1>
            <div className="overflow-x-auto">
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
            <div className="flex justify-center mt-4">
                <div className="join">
                    <button
                        className="join-item btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="join-item btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminComponent;