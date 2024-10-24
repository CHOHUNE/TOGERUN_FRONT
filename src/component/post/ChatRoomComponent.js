import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from "@stomp/stompjs";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { getChatRoom, joinChatRoom } from "../../api/chatAPI";

const WEBSOCKET_URL = 'wss://api.togerun.shop/chat'
// const WEBSOCKET_URL = 'ws://43.203.60.237/chat';

const ChatRoomComponent = ({ postId, userEmail }) => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const chatContainerRef = useRef(null);

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
            client?.connected && client.deactivate();
        };
    }, [postId]);

    const loadInitialData = useCallback(async () => {
        try {
            await joinChatRoom(postId, userEmail);
            const fetchedMessages = await getChatRoom(postId);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("Error loading initial data:", error);
        }
    }, [postId, userEmail]);

    const handleIncomingMessage = useCallback((message) => {
        const msg = JSON.parse(message.body);
        setMessages((prevMessages) => {
            if (!prevMessages.some(m => m.id === msg.id)) {
                return [...prevMessages, formatMessage(msg)];
            }
            return prevMessages;
        });
    }, []);

    const sendMessage = useCallback(() => {
        if (newMessage.trim() && stompClient?.connected) {
            const messageDTO = {
                content: newMessage.trim(),
                email: userEmail,
                createdAt: new Date().toISOString(),
                chatMessageType: 'NORMAL'
            };

            stompClient.publish({
                destination: `/app/chat/${postId}/send`,
                body: JSON.stringify(messageDTO)
            });
            setNewMessage('');
        }
    }, [stompClient, newMessage, postId, userEmail]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    useEffect(() => {
        loadInitialData();
        return setupWebSocket();
    }, [loadInitialData, setupWebSocket]);

    useEffect(() => {
        // 채팅 컨테이너의 스크롤을 맨 아래로 이동
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const formatTime = useCallback((timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, []);

    const formatMessage = useCallback((msg) => ({
        id: msg.id,
        content: msg.content,
        email: msg.email,
        nickname: msg.nickname,
        createdAt: msg.createdAt,
        chatMessageType: msg.chatMessageType
    }), []);

    const renderMessage = useCallback((message) => {
        if (message.chatMessageType === 'SYSTEM') {
            return (
                <div key={message.id} className="w-full flex justify-center">
                    <div className="bg-gray-300 text-gray-700 p-2 rounded">
                        <p>{message.content}</p>
                    </div>
                </div>
            );
        }
        return (
            <div
                key={message.id}
                className={`chat ${message.email === userEmail ? 'chat-end' : 'chat-start'}`}
            >
                <div className={`chat-bubble ${
                    message.email === userEmail
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-200 text-gray-900'
                }`}>
                    <p className="text-sm font-semibold mb-1">{message.nickname}</p>
                    <p>{message.content}</p>
                </div>
                <div className="chat-footer text-xs opacity-50 mt-1">
                    {formatTime(message.createdAt)}
                </div>
            </div>
        );
    }, [userEmail, formatTime]);

    return (
        <div className="flex flex-col rounded-lg overflow-hidden" style={{ height: '600px', maxWidth: '1000px', margin: '0 auto' }}>

            <div className="flex-1 flex flex-col" style={{ height: 'calc(100% - 116px)' }}>
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4"
                    style={{ maxHeight: '100%' }}
                >
                    {messages.map(renderMessage)}
                </div>
            </div>
            <div className="p-4 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 input input-bordered"
                        placeholder="메시지를 입력하세요"
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={sendMessage} className="btn btn-primary">
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            {!isOnline && (
                <div className="bg-warning text-warning-content p-2 text-center text-sm">
                    오프라인 상태입니다. 연결이 복구되면 메시지가 전송됩니다.
                </div>
            )}
        </div>
    );
}

export default React.memo(ChatRoomComponent);