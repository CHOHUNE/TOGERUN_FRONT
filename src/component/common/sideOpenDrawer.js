import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useNavigate} from 'react-router-dom';
import {UserGroupIcon, ClockIcon, ChatBubbleLeftEllipsisIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {getJoinedChatRoom} from "../../api/memberAPI";
import {leaveChatRoom} from "../../api/chatAPI";
import {UserIcon} from "@heroicons/react/24/outline";
import CustomModal from './CustomModal';
import LoadingSpinner from "./LoadingSpinner";

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

function SideOpenDrawer({isOpen, onClose}) {
    const [chatRooms, setChatRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [modalConfig, setModalConfig] = useState({show: false, title: '', content: '', onConfirm: null});
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
        const options = {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'};
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
                setModalConfig({show: false});
            } catch (err) {
                console.error("채팅방 나가기 실패", err);
                setError("채팅방 나가기에 실패했습니다.");
            }
        }
    };

    const openLeaveModal = (postId) => {
        setSelectedRoomId(postId);
        setModalConfig({
            show: true,
            title: '채팅방 나가기',
            content: '채팅방을 나가면 대화 내용이 모두 삭제됩니다. 정말 나가시겠습니까?',
            onConfirm: handleLeaveChatRoom
        });
    };

    const closeModal = () => {
        setModalConfig({show: false});
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="drawer-container">
            <style>{style}</style>
            <div className={`drawer-overlay ${isActive ? 'active' : ''}`} onClick={handleClose}></div>
            <div className={`drawer-content ${isActive ? 'active' : ''}`}>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 sm:p-6 rounded-b-xl shadow-md">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <UserIcon className="h-6 w-6 sm:h-8 sm:w-8"/>
                            <h2 className="text-lg sm:text-xl font-bold">참여 중인 채팅방</h2>
                        </div>
                        <button onClick={handleClose} className="text-white hover:text-gray-200 transition-colors">
                            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6"/>
                        </button>
                    </div>
                </div>

                {isLoading &&
                    <LoadingSpinner fullScreen={false} />
                }
                {error && <div className="alert alert-error text-sm m-2">{error}</div>}
                {chatRooms.map((room) => (
                    <div key={room.chatRoomId}
                         className="card bg-base-100 shadow-sm m-2 sm:m-3 hover:shadow-md transition-shadow duration-300">
                        <div className="card-body p-2 sm:p-3">
                            <h3 className="card-title text-sm font-semibold mb-1 sm:mb-2">{room.postTitle}</h3>
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
                                <div className="flex space-x-1 sm:space-x-2">
                                    <span
                                        className={`badge badge-xs sm:badge-sm ${room.participantCount < room.capacity ? 'badge-success' : 'badge-error'}`}>
                                        {room.participantCount < room.capacity ? '참여가능' : '마감'}
                                    </span>
                                    <span className="badge badge-xs sm:badge-sm badge-outline">
                                        {room.activityType}
                                    </span>
                                </div>
                                <div className="flex space-x-1 sm:space-x-2">
                                    <button
                                        onClick={() => handleChatRoomEntry(room.postId)}
                                        className="btn btn-primary btn-xs"
                                    >
                                        입장
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

            {modalConfig.show && (
                <CustomModal
                    title={modalConfig.title}
                    content={modalConfig.content}
                    onClose={closeModal}
                    onConfirm={modalConfig.onConfirm}
                />
            )}
        </div>,
        document.body
    );
}

export default SideOpenDrawer;