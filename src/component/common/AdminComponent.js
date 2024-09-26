import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMember, deleteMember, restoreMember } from "../../api/memberAPI";

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
        if (window.confirm('Are you sure you want to delete this user?')) {
            softDeleteMutation.mutate(userId);
        }
    };

    const handleRestore = (userId) => {
        if (window.confirm('Are you sure you want to restore this user?')) {
            restoreMutation.mutate(userId);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching users</div>;

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Admin Page - User Management</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Img</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Nickname</th>
                        <th>Social</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Mobile</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id} className={user.deleted ? "bg-gray-200" : ""}>
                            <td>{user.id}</td>
                            <td>
                                <img src={user.img} alt="User Image"
                                     className="w-10 h-10 rounded-full object-cover"/>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.nickname}</td>
                            <td>{user.social ? 'Yes' : 'No'}</td>
                            <td>{user.gender}</td>
                            <td>{user.age}</td>
                            <td>{user.mobile}</td>
                            <td>{user.roleNames}</td>
                            <td>
                                {user.deleted
                                    ? ` 삭제 시간: ${new Date(user.deletedAt).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })} `
                                    : "활성화"
                                }
                            </td>
                            <td>
                                {user.deleted ? (
                                    <button
                                        onClick={() => handleRestore(user.id)}
                                        className="btn btn-sm btn-success mr-2"
                                    >
                                        Restore
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleSoftDelete(user.id)}
                                        className="btn btn-sm btn-error mr-2"
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm mx-1 ${currentPage === i + 1 ? 'btn-active' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminComponent;