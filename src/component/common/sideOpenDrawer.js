import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UserGroupIcon, ClockIcon, ChatBubbleLeftEllipsisIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { getJoinedChatRoom } from "../../api/memberAPI";
import {leaveChatRoom} from "../../api/chatAPI";

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
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
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

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    const handleChatRoomEntry = (postId) => {
        navigate(`/post/${postId}/chat`);
        handleClose();
    };

    const handleLeaveChatRoom = async () => {
        if (selectedRoomId) {
            try {
                await leaveChatRoom(selectedRoomId);
                setChatRooms(chatRooms.filter(room => room.postId !== selectedRoomId));
                setShowLeaveModal(false);
            } catch (err) {
                console.error("채팅방 나가기 실패", err);
                setError("채팅방 나가기에 실패했습니다.");
            }
        }
    };

    const openLeaveModal = (postId) => {
        setSelectedRoomId(postId);
        setShowLeaveModal(true);
    };

    if (!isOpen) return null;

    const drawerContent = (
        <div className="drawer-container">
            <style>{style}</style>
            <div className={`drawer-overlay ${isActive ? 'active' : ''}`} onClick={handleClose}></div>
            <div className={`drawer-content ${isActive ? 'active' : ''}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">참여 중인 채팅방</h2>
                    <button onClick={handleClose} className="btn btn-ghost btn-circle">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                {isLoading && <div className="flex justify-center items-center h-24">
                    <div className="loading loading-spinner loading-md"></div>
                </div>}
                {error && <div className="alert alert-error text-sm">{error}</div>}
                {chatRooms.map((room) => (
                    <div key={room.chatRoomId} className="card bg-base-100 shadow-sm m-3 hover:shadow-md transition-shadow duration-300">
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
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleChatRoomEntry(room.postId)}
                                        className="btn btn-primary btn-xs"
                                    >
                                        채팅방 입장
                                    </button>
                                    <button
                                        onClick={() => openLeaveModal(room.postId)}
                                        className="btn btn-error btn-xs"
                                    >
                                        나가기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showLeaveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">채팅방을 나가시겠습니까?</h3>
                        <p className="mb-4">채팅방을 나가면 대화 내용이 모두 삭제됩니다.</p>
                        <div className="flex justify-end space-x-2">
                            <button className="btn btn-error" onClick={handleLeaveChatRoom}>나가기</button>
                            <button className="btn btn-ghost" onClick={() => setShowLeaveModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return ReactDOM.createPortal(drawerContent, document.body);
}

export default SideOpenDrawer;