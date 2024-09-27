import React, {useState} from 'react';
import {restoreMember} from "../../api/memberAPI";
import {useNavigate} from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";


function RestoreComponent({userId}) {
    const [restoredUser, setRestoredUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();
    const {moveToList} = useCustomMove();

    const handleRestore = async () => {
        setIsLoading(true);
        try {
            const response = await restoreMember(userId);
            setRestoredUser(response.data);
        } catch (err) {
            setError('Failed to restore user. Please try again.');
            console.error('Error restoring user:', err);
        } finally {
            setIsLoading(false);
            setShowModal(false);
            navigate('/post/list')
        }
    };

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <button onClick={moveToList}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Go Back
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    if (restoredUser) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-2xl font-bold mb-4">User Restored Successfully</h1>
                    <div className="mb-4">
                        <p>
                            <strong>User ID:</strong>
                            {restoredUser.id}</p>
                        <p>
                            <strong>Name:</strong>
                            {restoredUser.name}</p>
                        <p>
                            <strong>Email:</strong>
                            {restoredUser.email}</p>
                    </div>
                    <button onClick={moveToList}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Back to User List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">계정 복구</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    삭제된 계정입니다. 복구 하시겠습니까?
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    id="ok-btn"
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={handleRestore}
                                >
                                    예
                                </button>
                                <button
                                    id="cancel-btn"
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={moveToList}
                                >
                                    아니오
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestoreComponent;