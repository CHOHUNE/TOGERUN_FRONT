import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import { fetchMessages } from "../api/api";

const ChatRoom = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state)=>state.chat.chats);


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
        <div>
            Chat Room
            <div>
                {messages.map((message) => (
                    <div key={message.id}>
                     {message.content}
                    </div>
                ))}
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
            </div>
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
