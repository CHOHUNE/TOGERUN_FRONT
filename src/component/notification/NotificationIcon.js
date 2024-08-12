import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {basicURL, fetchNotifications, markNotificationAsRead} from "../../api/api";
import useEventSource from "../../hooks/useEventSource";

const NotificationComponent = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const notificationRef = useRef(null);
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['notifications', page],
        queryFn: () => fetchNotifications(page),
        keepPreviousData: true,
        staleTime: 5000,
    });

    const notifications = data?.content || [];
    const unreadCount = data?.unreadCount || 0;
    const hasMore = page < (data?.totalPages - 1 || 0);

    const handleNewNotification = useCallback(() => {

        queryClient.invalidateQueries({ queryKey: ['notifications'] });

    }, [queryClient]);



    useEventSource(`${basicURL}/notifications/subscribe`, handleNewNotification);

    const markAsRead = async (notification) => {
        try {
            await markNotificationAsRead(notification.id);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            navigate(notification.goUrl);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            setPage(0);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    };

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

    if (error) {
        console.error("Failed to fetch notifications:", error);
    }

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={toggleNotifications}
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
                        {isLoading ? (
                            <p className="text-center py-4">로딩 중...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-center py-4">알림이 없습니다.</p>
                        ) : (
                            notifications.map((notification) => (
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
                            ))
                        )}
                        {!isLoading && hasMore && (
                            <button
                                onClick={() => setPage(prev => prev + 1)}
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

export default NotificationComponent;