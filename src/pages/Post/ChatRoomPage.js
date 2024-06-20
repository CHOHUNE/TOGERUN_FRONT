import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import { fetchMessages } from "../../api/api";

const ChatRoomPage = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.chats);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        dispatch(fetchMessages());

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClientInstance = Stomp.over(socket);

        stompClientInstance.connect({}, () => {
            stompClientInstance.subscribe('/topic/messages', () => {
                dispatch(fetchMessages());
            });
        });

        setStompClient(stompClientInstance);

        return () => {
            if (stompClientInstance) {
                stompClientInstance.disconnect();
            }
        };
    }, [dispatch]);

    const sendMessage = async () => {
        if (stompClient && newMessage) {
            stompClient.send('/app/sendMessage', {}, JSON.stringify({ content: newMessage }));
            console.log(newMessage)
            setNewMessage('');
            dispatch(fetchMessages());
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Chat Room</h1>
            <div className="chat chat-start bg-base-100 p-4 rounded-box mb-4">
                {messages.map((message) => (
                    <div key={message.id} className="chat-bubble">
                        {message.content}
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Type your message"
                />
                <button onClick={sendMessage} className="btn btn-primary">Send</button>
            </div>
        </div>
    );
};

export default ChatRoomPage;
