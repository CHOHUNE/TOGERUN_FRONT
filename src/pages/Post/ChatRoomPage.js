import React, { useState, useEffect } from 'react';
import { getChatRoom } from "../../api/api";
import ChatRoomComponent from '../../component/post/ChatRoomComponent';

const ChatRoomPage = ({ postId }) => {
    const [chatRoomId, setChatRoomId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadChatRoom = async () => {
            try {
                const data = await getChatRoom(postId);
                setChatRoomId(data.chatRoomId);
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
    if (!chatRoomId) return <div>Chat room not found</div>;

    return (

        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Chat Room</h1>
            <ChatRoomComponent chatRoomId={chatRoomId} userEmail={userEmail} />
        </div>

    );
};

export default ChatRoomPage;