import React, { useState, useEffect } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import jwtAxios from "../../util/JwtUtil";
import { fetchMessages, joinChatRoom } from "../../api/memberApi";

const ChatRoomComponent = ({ postId, userEmail }) => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages(postId);
        joinChatRoom(postId, userEmail);

        const socket = new SockJS(`http://localhost:8080/ws/${postId}`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // auto reconnect
            debug: (str) => {
                console.log(str);
            }
        });

        client.onConnect = () => {
            client.subscribe(`/topic/${postId}`, (messageOutput) => {
                const message = JSON.parse(messageOutput.body);
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        };

        client.activate();

        setStompClient(client); // stompClient 상태 업데이트

        return () => {
            if (client && client.connected) {
                client.deactivate();
            }
        };
    }, [postId, userEmail]);

    const sendMessage = async () => {
        if (stompClient && stompClient.connected) {
            const messageDTO = { content: newMessage.trim(), userEmail: userEmail, chatRoomId: postId };
            stompClient.publish({
                destination: `/app/chat/${postId}/sendMessage`,
                body: JSON.stringify({ messageDTO })
            });
            setNewMessage('');
        }
    };

    return (
        <div>
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

export default ChatRoomComponent;
