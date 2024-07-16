import React, { useState, useEffect } from 'react';
import { Client } from "@stomp/stompjs";
import { fetchMessages, joinChatRoom } from "../../api/memberApi";

const ChatRoomComponent = ({ postId, userEmail }) => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {

        console.log("userEmail",userEmail)


        joinChatRoom(postId, userEmail).then( res => {
            console.log("join ChatRoom")
        }).catch(
            err => {
                console.log(err)
                console.log("error joining ChatRoom")
            }
        )

        fetchMessages(postId).then(
            res => {
                setMessages(res)
                console.log(res)
                console.log("fetchMessages",messages)


            }).catch(
            err => {
                console.log(err)
            }
        )

        // const socket = new SockJS(`http://localhost:8080/ws/${postId}/chat`);
        // 웹소켓 연결시 SockJs 클라이언트를 사용하면 기본적으로 현재 세션의 쿠키 정보를 웹소켓 연결 요청에 포함 시키려고 시도한다.
        // 즉 브라우저는 자동으로 현재 쿠키를 요청 헤더에 담아 요청을 보낸다.
        // 담아보낼 쿠키를 커스텀 할수 없나? -> SockJS 는 쿠키를 커스텀 할수 없다.
        // 웹소켓 URL 에 추가 전달 하는 방법이 있긴 하다. -> http://localhost:8080/ws/{postId}?token=token
        // 근데 좀 비효율 적인 듯?...
        // 일단 순수 Socket 으로 진행 해본다. -> 폭 넓은 브라우저 지원은 못하지만 모던 브라우저 타겟과 가볍다는 장점이 있다.


        const client = new Client({
            brokerURL: `ws://localhost:8080/chat`,
            // webSocketFactory: () => socket,
            reconnectDelay: 500, // auto reconnect
            onConnect:()=>{
                client.subscribe(`/topic/chat/${postId}`, (message) => {
                    const msg = JSON.parse(message.body);
                    console.log("Received raw message:", msg);

                    const formattedMsg = {
                        id: msg.id,
                        content: msg.content,
                        email: msg.email
                    };

                    setMessages((prevMessages) => [...prevMessages, formattedMsg]);
                    console.log("Formatted and added message:", formattedMsg);
                });
            },
            debug: (str) => {
                console.log(str);
            }
        });

        client.activate();
        setStompClient(client); // stompClient 상태 업데이트

        return () => {
            if (client && client.connected) {
                client.deactivate();
            }
        };
    }, [postId, userEmail]);

    const sendMessage = async () => {
        if (stompClient && newMessage) {
            const messageDTO = {
                content: newMessage.trim(),
                email: userEmail
            };
            stompClient.publish({
                destination: `/app/chat/${postId}/send`,
                body: JSON.stringify( messageDTO )
            });

            // setMessages((prevMessages) => [...prevMessages, messageDTO]);
            setNewMessage('');

            console.log("Sent Message",messageDTO)
        }


    };

    return (
        <div>
            <div className="chat chat-start bg-base-100 p-4 rounded-box mb-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-bubble ${message.email === userEmail ? 'chat-bubble-right' : 'chat-bubble-left'}`}
                    >
                        {message.email} : {message.content}
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
