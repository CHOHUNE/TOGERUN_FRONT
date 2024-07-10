import React, { useState, useEffect } from 'react';
import { Stomp } from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import jwtAxios from "../../util/JwtUtil";


const ChatRoomComponent = ({ postId, userEmail }) => {


    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);


    console.log("postId{}", postId,"userEmail{}", userEmail)

        const fetchMessages = async ()=>{

            try{
                const response = await jwtAxios.get(`/post/${postId}/chat`)
                setMessages(response.data)
            }catch(error){
                console.error("Failed to fetch messages",error)
            }
        }

        const joinChatRoom =async()=>{
            try {
                await jwtAxios.post(`/chatroom/join`, null, {
                    params: {postId: postId, email: userEmail}
                });

            } catch (error){
                console.error("Failed to join chat room",error)
            }
        };

    useEffect(() => {

        fetchMessages()

        joinChatRoom();


        const socket = new SockJS(`http://localhost:8080/ws/${postId}`);
        const stompClientInstance = Stomp.over(socket);

        stompClientInstance.connect({
        }, () => {
            stompClientInstance.subscribe(`/topic/${postId}`, (messageOutput) => {

                const message = JSON.parse(messageOutput.body);
                setMessages((prevMessages) => [...prevMessages, message]);

            });
        });

        setStompClient(stompClientInstance); // stompClient 상태 업데이트

        return () => {
            if (stompClientInstance && stompClientInstance.connected) {
                stompClientInstance.disconnect();
            }
        };
    }, [postId, userEmail]);

    const sendMessage = async () => {
        if (stompClient && stompClient.connected ) {
            const messageDTO = { content: messages.trim(), userEmail: userEmail, chatRoomId: postId };
            stompClient.send(`/app/chat/${postId}/sendMessage`, {},
                JSON.stringify({
                    messageDTO
                }));
            setMessages('');
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
                    value={messages}
                    onChange={(e) => setMessages(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Type your message"
                />
                <button onClick={sendMessage} className="btn btn-primary">Send</button>
            </div>
        </div>
    );
};

export default ChatRoomComponent;