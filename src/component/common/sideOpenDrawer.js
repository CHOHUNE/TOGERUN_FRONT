import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserGroupIcon, ClockIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import {getJoinedChatRoom} from "../../api/chatAPI";


import {getJoinedChatRoom} from "../../api/memberAPI";

function SideOpenDrawer({ isOpen, onClose }) {
    const [chatRooms, setChatRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatRooms = async () => {
            setIsLoading(true);
            try {
                const data = await getJoinedChatRoom();
                setChatRooms(data);
            } catch (err) {
                setError('채팅방 불러오기 실패');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchChatRooms();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    const handleChatRoomEntry = (postId) => {
        navigate(`/post/${postId}/chat`);
        onClose(); // 채팅방으로 이동 후 사이드 드로어를 닫습니다.
    };

    return (
        <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={isOpen} readOnly />
            <div className="drawer-side">
                <label htmlFor="my-drawer-4" className="drawer-overlay" onClick={onClose}></label>
                <div className="menu p-4 w-72 min-h-full bg-base-200 text-base-content">
                    <h2 className="text-lg font-bold mb-4 text-center">참여 중인 채팅방</h2>
                    {isLoading && <div className="flex justify-center items-center h-24"><div className="loading loading-spinner loading-md"></div></div>}
                    {error && <div className="alert alert-error text-sm">{error}</div>}
                    {chatRooms.map((room) => (
                        <div key={room.chatRoomId} className="card bg-base-100 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300">
                            <div className="card-body p-3">
                                <h3 className="card-title text-sm font-semibold mb-2">{room.postTitle}</h3>
                                <div className="space-y-1 text-xs">
                                    <p className="flex items-center">
                                        <ClockIcon className="h-3 w-3 mr-1 text-blue-500" />
                                        {formatDate(room.meetingTime)}
                                    </p>
                                    <p className="flex items-center">
                                        <UserGroupIcon className="h-3 w-3 mr-1 text-green-500" />
                                        {room.participantCount}/{room.capacity}
                                    </p>
                                    <p className="flex items-center truncate">
                                        <ChatBubbleLeftEllipsisIcon className="h-3 w-3 mr-1 text-purple-500" />
                                        {room.lastMessagePreview || '메시지 없음'}
                                    </p>
                                </div>
                                <div className="card-actions justify-between items-center mt-2">
                                    <span className={`badge badge-sm ${room.participantCount < room.capacity ? 'badge-success' : 'badge-error'}`}>
                                        {room.participantCount < room.capacity ? '참여가능' : '마감'}
                                    </span>
                                    <button
                                        onClick={() => handleChatRoomEntry(room.postId)}
                                        className="btn btn-primary btn-xs"
                                    >
                                        채팅방 입장
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SideOpenDrawer;