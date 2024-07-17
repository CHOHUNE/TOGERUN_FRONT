import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from "@stomp/stompjs";
import { fetchMessages, joinChatRoom } from "../../api/memberApi";

// 상수
const SCROLL_THRESHOLD = 100;
const WEBSOCKET_URL = 'ws://localhost:8080/chat';

const ChatRoomComponent = ({ postId, userEmail }) => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isNearBottom, setIsNearBottom] = useState(true);

    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    // 웹소켓 연결 설정
    const setupWebSocket = useCallback(() => {
        const client = new Client({
            brokerURL: WEBSOCKET_URL,
            reconnectDelay: 500,
            onConnect: () => {
                client.subscribe(`/topic/chat/${postId}`, handleIncomingMessage);
            },
            debug: console.log
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client && client.connected) {
                client.deactivate();
            }
        };
    }, [postId]);

    // 초기 데이터 로드
    const loadInitialData = useCallback(async () => {
        try {
            await joinChatRoom(postId, userEmail);
            const fetchedMessages = await fetchMessages(postId);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("Error loading initial data:", error);
        }
    }, [postId, userEmail]);

    // 메시지 수신 처리
    const handleIncomingMessage = useCallback((message) => {
        const msg = JSON.parse(message.body);
        const formattedMsg = {
            id: msg.id,
            content: msg.content,
            email: msg.email,
            createdAt: msg.createdAt,
            chatMessageType: msg.chatMessageType
        };
        setMessages((prevMessages) => [...prevMessages, formattedMsg]);
    }, []);

    // 메시지 전송
    const sendMessage = useCallback(() => {
        if (stompClient && newMessage.trim()) {
            const messageDTO = {
                content: newMessage.trim(),
                email: userEmail,
                createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString(),
                chatMessageType: 'NORMAL'
            };
            stompClient.publish({
                destination: `/app/chat/${postId}/send`,
                body: JSON.stringify(messageDTO)
            });
            setNewMessage('');
        }
    }, [stompClient, newMessage, postId, userEmail]);

    // 스크롤 관련 함수들
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = scrollContainerRef.current;
            setIsNearBottom(scrollHeight - (scrollTop + clientHeight) < SCROLL_THRESHOLD);
        }
    };

    // 키 입력 처리
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 초기 설정 및 데이터 로드
    useEffect(() => {
        loadInitialData();
        return setupWebSocket();
    }, [loadInitialData, setupWebSocket]);

    // 스크롤 이벤트 리스너 설정
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // 메시지 추가 시 스크롤 처리
    useEffect(() => {
        if (isNearBottom) {
            scrollToBottom();
        }
    }, [messages]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };


    return (
        <div className="flex flex-col h-screen">
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4"
                onScroll={handleScroll}
            >
                {messages.map((message) => (
                    message.chatMessageType === 'SYSTEM' ? (
                        <div
                            key={message.id}
                            className="w-full flex justify-center"
                        >
                            <div className="bg-gray-300 text-gray-700 p-2 rounded">
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ) : (
                        <div
                            key={message.id}
                            className={`chat ${message.email === userEmail ? 'chat-end' : 'chat-start'}`}
                        >
                            <div className={`chat-bubble ${
                                message.email === userEmail
                                    ? 'bg-white text-gray-900'
                                    : 'bg-gray-200 text-gray-900'
                            }`}>
                                <p className="text-sm font-semibold mb-1">{message.email}</p>
                                <p>{message.content}</p>
                            </div>
                            <div className="chat-footer text-xs opacity-50 mt-1">
                                {formatTime(message.createdAt)}
                            </div>
                        </div>
                    )
                ))}
                <div ref={messagesEndRef}/>
            </div>

            {!isNearBottom && (
                <button
                    onClick={scrollToBottom}
                    className="fixed bottom-20 right-4 bg-blue-500 text-white rounded-full p-2"
                >
                    New messages
                </button>
            )}

            <div className="bg-gray-100 p-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 input input-bordered"
                        placeholder="Type your message"
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={sendMessage} className="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatRoomComponent;