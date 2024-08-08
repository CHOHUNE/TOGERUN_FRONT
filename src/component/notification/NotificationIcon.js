import React, { useCallback, useEffect, useState, useRef } from 'react';
import useEventSource from "../../hooks/useEventSource";
import jwtAxios from "../../util/JwtUtil";
import { useNavigate } from "react-router-dom";

const NotificationIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const lastEventIdRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setPage(1);
            fetchNotifications(1, true);
        }
    };

    const fetchNotifications = useCallback((pageNum, reset = false) => {
        jwtAxios.get(`/api/notifications/all?page=${pageNum}&size=8`)
            .then(response => {
                const newNotifications = response.data.content;
                setNotifications(prev => reset ? newNotifications : [...prev, ...newNotifications]);

                setHasMore(response.data.hasNext);
                setUnreadCount(response.data.unreadCount);

            })
            .catch(error => console.log("Error fetching Notifications", error));
    }, []);

    const handleNewEvent = useCallback((event) => {
        const data = JSON.parse(event.data);
        setNotifications(prev => [data, ...prev.slice(0, 7)]);  // Keep only the latest 8 notifications
        setUnreadCount(prev => prev + 1);
        lastEventIdRef.current = event.lastEventId;
    }, []);

    const handleError = useCallback((error) => {
        console.error('EventSource error:', error);
        // 여기에 재연결 로직 추가
    }, []);

    useEventSource(
        'http://localhost:8080/api/notifications/subscribe',
        handleNewEvent,
        handleError,
        lastEventIdRef.current
    );

    useEffect(() => {
        fetchNotifications(1, true);
    }, [fetchNotifications]);

    const loadMore = () => {
        if (hasMore) {
            setPage(prev => prev + 1);
            fetchNotifications(page + 1);
        }
    };

    const markAsRead = useCallback((notificationId) => {
        jwtAxios.post(`/api/notifications/${notificationId}/read`)
            .then(() => {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === notificationId ? {...notif, isRead: true} : notif
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            })
            .catch(error => console.log("Error marking notification as read", error));
    }, []);

    return (
        <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle" onClick={toggleDropdown}>
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && <span className="badge badge-xs badge-primary indicator-item">{unreadCount}</span>}
                </div>
            </button>
            {isOpen && (
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 mt-2 max-h-60 overflow-y-auto">
                    {notifications.map(notification => (
                        <li key={notification.id}
                            onClick={() => {
                                navigate(notification.goUrl);
                                if (!notification.isRead) markAsRead(notification.id);
                            }}
                            className={`cursor-pointer ${notification.isRead ? 'opacity-50' : ''}`}>
                            <a className="p-2 hover:bg-gray-100">
                                <strong className="font-bold">{notification.nickname}</strong>: {notification.content}
                            </a>
                        </li>
                    ))}
                    {hasMore && (
                        <li className="text-center">
                            <button onClick={loadMore} className="btn btn-ghost btn-sm">더 보기</button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default NotificationIcon;