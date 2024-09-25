import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Client } from "@stomp/stompjs";
import { fetchMessages } from "../../api/memberAPI";
import {PaperAirplaneIcon} from "@heroicons/react/16/solid";
import {ChatBubbleLeftEllipsisIcon} from "@heroicons/react/24/solid";
import {joinChatRoom} from "../../api/chatAPI";

const SCROLL_THRESHOLD = 100;
const WEBSOCKET_URL = 'ws://localhost:8080/chat';

const ChatRoomComponent = ({ postId, userEmail }) => {
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [offlineMessages, setOfflineMessages] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

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
        const startTime = performance.now();
        try {
            await joinChatRoom(postId, userEmail);
            const fetchedMessages = await fetchMessages(postId);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("Error loading initial data:", error);
        }
        const endTime = performance.now();
        console.log(`Initial data load time: ${endTime - startTime}ms`);
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

    const sendMessage = useCallback(async () => {
        if (newMessage.trim()) {
            const messageDTO = {
                content: newMessage.trim(),
                email: userEmail,
                createdAt: new Date().toISOString(),
                chatMessageType: 'NORMAL'
            };

            if (isOnline && stompClient) {
                const startTime = performance.now();
                stompClient.publish({
                    destination: `/app/chat/${postId}/send`,
                    body: JSON.stringify(messageDTO)
                });
                const endTime = performance.now();
                console.log(`Message send time: ${endTime - startTime}ms`);
            } else {
                setOfflineMessages(prev => [...prev, messageDTO]);
            }
            setNewMessage('');
        }
    }, [stompClient, newMessage, postId, userEmail, isOnline]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            setIsNearBottom(scrollHeight - (scrollTop + clientHeight) < SCROLL_THRESHOLD);
        }
    }, []);

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
        const scrollContainer = scrollContainerRef.current;
        scrollContainer?.addEventListener('scroll', handleScroll);
        return () => scrollContainer?.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        isNearBottom && scrollToBottom();
    }, [messages, isNearBottom, scrollToBottom]);

    useEffect(() => {
        const handleOnline = async () => {
            setIsOnline(true);
            console.log("Connection restored. Syncing messages.");
            if (offlineMessages.length > 0) {
                for (const msg of offlineMessages) {
                    await sendMessage(msg);
                }
                setOfflineMessages([]);
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            console.log("Connection lost. Switching to offline mode.");
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [offlineMessages, sendMessage]);

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

    const memoizedMessages = useMemo(() => messages.map(renderMessage), [messages, renderMessage]);

    return (
        <div className="flex flex-col bg-base-100 shadow-xl rounded-lg overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="bg-base-200 p-4">
                <h2 className="text-xl font-bold">채팅방</h2>
            </div>
            <div className="flex-1 flex flex-col h-[calc(100vh-250px)]">
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-4"
                    onScroll={handleScroll}
                >
                    {memoizedMessages}
                    <div ref={messagesEndRef} />
                </div>

                {!isNearBottom && (
                    <button
                        onClick={scrollToBottom}
                        className="btn btn-circle btn-sm fixed bottom-24 right-8 bg-primary text-white"
                    >
                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                    </button>
                )}

                <div className="bg-base-200 p-4">
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