import React, { useState, useEffect } from 'react';
import ChatRoomComponent from '../../component/post/ChatRoomComponent';
import useCustomLogin from "../../hooks/useCustomLogin";
import { useNavigate, useParams } from "react-router-dom";
import { getChatRoom, leaveChatRoom } from "../../api/chatAPI";
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import CustomModal from "../../component/common/CustomModal";
import LoadingSpinner from "../../component/common/LoadingSpinner";

const ChatRoomPage = () => {
    const { postId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loginState } = useCustomLogin();
    const [modalConfig, setModalConfig] = useState({ show: false, title: '', content: '', onConfirm: null });
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

    const openLeaveModal = () => {
        setModalConfig({
            show: true,
            title: '채팅방 나가기',
            content: '채팅방을 나가면 대화 내용이 삭제되며 다시 입장할 수 없습니다. 정말 나가시겠습니까?',
            onConfirm: handleLeaveChatRoom
        });
    };

    const closeModal = () => {
        setModalConfig({ show: false });
    };

    const handleLeaveChatRoom = async () => {
        try {
            await leaveChatRoom(postId);
            navigate('/');
        } catch (err) {
            setError("채팅방을 나가는데 실패했습니다.");
        } finally {
            closeModal();
        }
    };

    if (loading) return <LoadingSpinner fullScreen={true}/>;

    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">오류!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="shadow-lg rounded-lg overflow-hidden">
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
                            onClick={openLeaveModal}
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

export default ChatRoomPage;