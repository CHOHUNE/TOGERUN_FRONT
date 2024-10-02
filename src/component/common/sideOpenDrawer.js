import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UserGroupIcon, ClockIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { getJoinedChatRoom } from "../../api/memberAPI";

const style = `
  .drawer-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
  }
  .drawer-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }
  .drawer-overlay.active {
    opacity: 1;
  }
  .drawer-content {
    position: fixed;
    top: 0;
    right: -300px;
    bottom: 0;
    width: 300px;
    background-color: white;
    overflow-y: auto;
    transition: right 0.3s ease-out;
  }
  .drawer-content.active {
    right: 0;
  }
`;

function SideOpenDrawer({ isOpen, onClose }) {
    const [chatRooms, setChatRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setIsActive(true);
            fetchChatRooms();
        } else {
            setIsActive(false);
        }
    }, [isOpen]);

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

    const handleClose = () => {
        setIsActive(false);
        setTimeout(onClose, 300); // Wait for the animation to complete
    };

    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    const handleChatRoomEntry = (postId) => {
        navigate(`/post/${postId}/chat`);
        handleClose();
    };

    const drawerContent = (
        <div className="drawer-container">
            <style>{style}</style>
            <div className={`drawer-overlay ${isActive ? 'active' : ''}`} onClick={handleClose}></div>
            <div className={`drawer-content ${isActive ? 'active' : ''}`}>
                <h2 className="text-lg font-bold mb-4 text-center">참여 중인 채팅방</h2>
                {isLoading && <div className="flex justify-center items-center h-24">
                    <div className="loading loading-spinner loading-md"></div>
                </div>}
                {error && <div className="alert alert-error text-sm">{error}</div>}
                {chatRooms.map((room) => (
                    <div key={room.chatRoomId} className="card bg-base-100 shadow-sm mb-3 hover:shadow-md transition-shadow duration-300">
                        <div className="card-body p-3">
                            <h3 className="card-title text-sm font-semibold mb-2">{room.postTitle}</h3>
                            <div className="space-y-1 text-xs">
                                <p className="flex items-center">
                                    <ClockIcon className="h-3 w-3 mr-1 text-blue-500"/>
                                    {formatDate(room.meetingTime)}
                                </p>
                                <p className="flex items-center">
                                    <UserGroupIcon className="h-3 w-3 mr-1 text-green-500"/>
                                    {room.participantCount}/{room.capacity}
                                </p>
                                <p className="flex items-center truncate">
                                    <ChatBubbleLeftEllipsisIcon className="h-3 w-3 mr-1 text-purple-500"/>
                                    {room.lastMessagePreview || '메시지 없음'}
                                </p>
                            </div>
                            <div className="card-actions justify-between items-center mt-2">
                                <div className="flex space-x-2">
                                    <span className={`badge badge-sm ${room.participantCount < room.capacity ? 'badge-success' : 'badge-error'}`}>
                                        {room.participantCount < room.capacity ? '참여가능' : '마감'}
                                    </span>
                                    <span className="badge badge-sm badge-outline">
                                        {room.activityType}
                                    </span>
                                </div>
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
    );

    return ReactDOM.createPortal(drawerContent, document.body);
}

export default SideOpenDrawer;