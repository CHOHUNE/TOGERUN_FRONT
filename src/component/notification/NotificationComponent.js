import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { basicURL, fetchNotifications, markNotificationAsRead, fetchUnreadCount } from "../../api/api";
import useEventSource from "../../hooks/useEventSource";

const NotificationComponent = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();
    const notificationRef = useRef(null);
    const queryClient = useQueryClient();

    const { data: notificationsData, isLoading, error, isFetching } = useQuery({
        queryKey: ['notifications', page],
        queryFn: () => fetchNotifications(page),
        keepPreviousData: true,
        staleTime: 5000,
        enabled: showNotifications,
    });

    const { data: unreadCountData } = useQuery({
        queryKey: ['unreadCount'],
        queryFn: fetchUnreadCount,
        refetchInterval: 60000,
    });

    const notifications = notificationsData?.content || [];
    const unreadCount = typeof unreadCountData === 'number' ? unreadCountData : 0;
    const hasNextPage = notificationsData.currentPage < notificationsData.totalPages - 1 || notifications.length < notificationsData.totalElements;


    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: ['notifications', page] });
            queryClient.setQueryData(['notifications', page], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    content: old.content.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    ),
                };
            });
            return { notificationId };
        },
        onError: (err, notificationId, context) => {
            queryClient.setQueryData(['notifications', page], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    content: old.content.map(n =>
                        n.id === notificationId ? { ...n, isRead: false } : n
                    ),
                };
            });
            queryClient.setQueryData(['unreadCount'], (oldCount) => {
                const currentCount = typeof oldCount === 'number' ? oldCount : 0;
                return currentCount + 1;
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });

    const handleNewNotification = useCallback((event) => {
        const messageData = event.data;
        console.log('Received SSE message:', messageData);
        if (messageData === 'EventStream Created') {
            console.log('EventStream connection established');
            return;
        }
        try {
            const parsedData = JSON.parse(messageData);
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['notifications', page] });
        } catch (error) {
            console.log('Error parsing SSE message:', error);
        }
    }, [queryClient]);

    useEventSource(`${basicURL}/notifications/subscribe`, handleNewNotification);

    const markAsRead = useCallback(async (notification) => {
        try {
            await markAsReadMutation.mutateAsync(notification.id);
            navigate(notification.goUrl);
            setShowNotifications(false)
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }, [markAsReadMutation, navigate]);

    const toggleNotifications = useCallback(() => {
        setShowNotifications(prev => !prev);
        if (!showNotifications) {
            setPage(0);
            queryClient.invalidateQueries({ queryKey: ['notifications', 0] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        }
    }, [showNotifications, queryClient]);

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
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
        <div className="relative mr-4" ref={notificationRef}>
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 max-h-[80vh] flex flex-col">
                    <div className="py-2 flex-grow overflow-y-auto">
                        {isLoading ? (
                            <p className="text-center py-4">로딩 중...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-center py-4">알림이 없습니다.</p>
                        ) : (
                            <>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                            notification.isRead ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                        onClick={() => markAsRead(notification)}
                                    >
                                        <p className="text-sm text-gray-600">{notification.content}</p>
                                        <p className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
                                    </div>
                                ))}
                                {hasNextPage && (
                                    <button
                                        onClick={loadMore}
                                        disabled={isFetching}
                                        className="w-full py-2 text-sm text-blue-500 hover:bg-gray-100"
                                    >
                                        {isFetching ? '로딩 중...' : '더 보기'}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;