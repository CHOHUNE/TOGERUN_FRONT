import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import jwtAxios from "../../util/JwtUtil";
import useEventSource from "../../hooks/useEventSource";
import {useNavigate} from "react-router-dom";
import {basicURL} from "../../api/api";

const NotificationIcon = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const notificationRef = useRef(null);

    const navigate = useNavigate();

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await jwtAxios.get(`/notifications/all?page=${page}&size=7`);
            setNotifications(prev => {
                const newNotifications = response.data.content;
                const uniqueNotifications = [...prev];
                newNotifications.forEach(newNotif => {
                    if (!uniqueNotifications.some(notif => notif.id === newNotif.id)) {
                        uniqueNotifications.push(newNotif);
                    }
                });
                return uniqueNotifications;
            });
            setUnreadCount(response.data.unreadCount);
            setHasMore(page < response.data.totalPages - 1);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [page]);

    useEffect(() => {
        if (showNotifications && isInitialLoad) {
            fetchNotifications();
            setIsInitialLoad(false);
        }
    }, [showNotifications, isInitialLoad, fetchNotifications]);

    const handleNewNotification = useCallback((event) => {
        const newNotification = JSON.parse(event.data);
        setNotifications(prev => {
            if (!prev.some(notif => notif.id === newNotification.id)) {
                return [newNotification, ...prev];
            }
            return prev;
        });
        setUnreadCount(prev => prev + 1);
    }, []);

    useEventSource('http://localhost:8080/api/notifications/subscribe', handleNewNotification);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    const markAsRead = async (notification) => {
        try {
            await jwtAxios.post(`/notifications/${notification.id}/read`);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notification.Id ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => prev - 1);

            navigate(notification.goUrl)

        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={handleNotificationClick}
                className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 max-h-[80vh] overflow-y-auto">
                    <div className="py-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`px-4 py-2 hover:bg-gray-100 ${
                                    notification.isRead ? 'bg-gray-50' : 'bg-white'
                                }`}
                                onClick={() => markAsRead(notification)}
                            >

                                <p className="text-sm text-gray-600">{notification.content}</p>
                                <p className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                        {hasMore && (
                            <button
                                onClick={fetchNotifications}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200"
                            >
                                더 보기
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationIcon;