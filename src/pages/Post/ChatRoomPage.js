import React, { useState, useEffect } from 'react';
import { getChatRoom } from "../../api/api";
import ChatRoomComponent from '../../component/post/ChatRoomComponent';
import useCustomLogin from "../../hooks/useCustomLogin";
import {useParams} from "react-router-dom";

const ChatRoomPage = () => {

    const {postId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {loginState} = useCustomLogin()

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

    return (

        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Chat Room</h1>
            <ChatRoomComponent postId={postId} userEmail={loginState.email} />
        </div>

    );
};

export default ChatRoomPage;