import React, { useState, useEffect } from 'react';
import { getChatRoom } from "../../api/api";
import ChatRoomComponent from '../../component/post/ChatRoomComponent';
import useCustomLogin from "../../hooks/useCustomLogin";
import {useNavigate, useParams} from "react-router-dom";

const ChatRoomPage = () => {

    const {postId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {loginState} = useCustomLogin()

    const navigate = useNavigate();

    useEffect(() => {
        const loadChatRoom = async () => {
            try {
                const data = await getChatRoom(postId);
                // setChatRoomId(data.chatRoomId);
                setLoading(false);
            } catch (err) {
                setError("Failed to load chat room");
                setLoading(false);
            }
        };

        loadChatRoom();
    }, [postId]);


    console.log("postId:", postId, "userEmail:", loginState.email, "nickname:", loginState.nickname)

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleLeave = () => {
        navigate(-1);  // 이전 페이지로 이동
    };


    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Chat Room</h1>
                <button
                    className="btn btn-outline btn-error"
                    onClick={handleLeave}
                >
                    나가기
                </button>
            </div>
            <ChatRoomComponent postId={postId} userEmail={loginState.email} />
        </div>
    );
};

export default ChatRoomPage;