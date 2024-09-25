import React, { useState, useEffect } from 'react';
import ChatRoomComponent from '../../component/post/ChatRoomComponent';
import useCustomLogin from "../../hooks/useCustomLogin";
import { useNavigate, useParams } from "react-router-dom";
import {getChatRoom, leaveChatRoom} from "../../api/chatAPI";

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
                setError("Failed to load chat room");
                setLoading(false);
            }
        };

        loadChatRoom();
    }, [postId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleLeaveModal = () => {
        setShowLeaveModal(!showLeaveModal);
    };

    const handleLeaveChatRoom = async () => {
        try {
            await leaveChatRoom(postId);
            navigate('/'); // Assuming you want to navigate to the home page after leaving
        } catch (err) {
            setError("Failed to leave chat room");
        } finally {
            toggleLeaveModal(); // Close the modal after the action
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Chat Room</h1>
                <div>
                    <button
                        className="btn btn-outline btn-neutral mr-2"
                        onClick={handleGoBack}
                    >
                        뒤로가기
                    </button>
                    <button
                        className="btn btn-outline btn-error"
                        onClick={toggleLeaveModal}
                    >
                        채팅방 나가기
                    </button>
                </div>
            </div>
            <ChatRoomComponent postId={postId} userEmail={loginState.email}/>

            {showLeaveModal && (
                <div className="modal modal-open z-50">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">채팅방에서 나가시겠습니까?</h3>
                        <div className="modal-action py-5">
                            <button className="btn btn-outline btn-error" onClick={handleLeaveChatRoom}>Yes</button>
                            <button className="btn btn-outline btn-neutral" onClick={toggleLeaveModal}>No</button>
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggleLeaveModal}>✕</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatRoomPage;