import React, { useState, useEffect } from 'react';
import ChatRoomComponent from '../../component/post/ChatRoomComponent';
import useCustomLogin from "../../hooks/useCustomLogin";
import { useNavigate, useParams } from "react-router-dom";
import { getChatRoom, leaveChatRoom } from "../../api/chatAPI";
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ChatRoomPage = () => {
    const { postId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loginState } = useCustomLogin();
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadChatRoom = async () => {
            try {
                await getChatRoom(postId);
                setLoading(false);
            } catch (err) {
                setError("채팅방을 불러오는데 실패했습니다.");
                setLoading(false);
            }
        };

        loadChatRoom();
    }, [postId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleLeaveModal = () => {
        setShowLeaveModal(!showLeaveModal);
    };

    const handleLeaveChatRoom = async () => {
        try {
            await leaveChatRoom(postId);
            navigate('/');
        } catch (err) {
            setError("채팅방을 나가는데 실패했습니다.");
        } finally {
            toggleLeaveModal();
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">오류!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
                    <h1 className="text-2xl font-bold">채팅방</h1>
                    <div>
                        <button
                            className="btn btn-ghost btn-sm text-white mr-2"
                            onClick={handleGoBack}
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            뒤로가기
                        </button>
                        <button
                            className="btn btn-error btn-sm text-white"
                            onClick={toggleLeaveModal}
                        >
                            <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
                            나가기
                        </button>
                    </div>
                </div>
                <div className="p-4">
                    <ChatRoomComponent postId={postId} userEmail={loginState.email}/>
                </div>
            </div>

            {showLeaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-4">채팅방에서 나가시겠습니까?</h3>
                        <p className="mb-4">채팅방을 나가면 대화 내용이 삭제되며 다시 입장할 수 없습니다.</p>
                        <div className="flex justify-end gap-2">
                            <button className="btn btn-error" onClick={handleLeaveChatRoom}>나가기</button>
                            <button className="btn btn-ghost" onClick={toggleLeaveModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatRoomPage;