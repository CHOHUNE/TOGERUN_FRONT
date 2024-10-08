import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { basicURL, fetchNotifications, markNotificationAsRead, fetchUnreadCount, clearNotification } from "../../api/api";
import useEventSource from "../../hooks/useEventSource";
import CustomModal from "../common/CustomModal";

const NotificationComponent = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const navigate = useNavigate();
    const notificationRef = useRef(null);
    const queryClient = useQueryClient();

    const {
        data: notificationsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch
    } = useInfiniteQuery({
        queryKey: ['notifications'],
        queryFn: ({ pageParam = 0 }) => fetchNotifications(pageParam),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.currentPage < lastPage.totalPages - 1 && allPages.length < 5) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
        enabled: showNotifications,
    });

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['unreadCount'],
        queryFn: fetchUnreadCount,
        refetchInterval: 60000,
    });

    const notifications = notificationsData?.pages.flatMap(page => page.content) || [];

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] });
            const previousNotifications = queryClient.getQueryData(['notifications']);
            queryClient.setQueryData(['notifications'], (old) => ({
                ...old,
                pages: old.pages.map(page => ({
                    ...page,
                    content: page.content.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    ),
                })),
            }));
            return { previousNotifications };
        },
        onError: (err, notificationId, context) => {
            queryClient.setQueryData(['notifications'], context.previousNotifications);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });

    const clearAllNotificationsMutation = useMutation({
        mutationFn: clearNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });

    const handleNewNotification = useCallback((event) => {
        const messageData = event.data;
        if (messageData !== 'EventStream Created') {
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    }, [queryClient]);

    useEventSource(`${basicURL}/notifications/subscribe`, handleNewNotification);

    const markAsRead = useCallback(async (notification) => {
        try {
            await markAsReadMutation.mutateAsync(notification.id);
            navigate(notification.goUrl);
            setShowNotifications(false);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }, [markAsReadMutation, navigate]);

    const toggleNotifications = useCallback(() => {
        setShowNotifications(prev => {
            if (!prev) {
                refetch({ refetchPage: (page, index) => index === 0 });
                queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            }
            return !prev;
        });
    }, [queryClient, refetch]);

    const handleClearAllNotifications = useCallback(async () => {
        try {
            await clearAllNotificationsMutation.mutateAsync();
            setShowClearModal(false);
            setShowNotifications(false);
        } catch (error) {
            console.error("Failed to clear all notifications:", error);
        }
    }, [clearAllNotificationsMutation]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10 max-h-[40vh] flex flex-col">
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
                                <div className="flex justify-between px-4 py-2 border-t">
                                    {hasNextPage && (
                                        <button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            className="text-sm text-blue-500 hover:text-blue-700"
                                        >
                                            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowClearModal(true)}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        모두 읽기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showClearModal && (
                <CustomModal
                    title="알림 모두 읽기"
                    content="모든 알림을 읽음 처리하시겠습니까?"
                    onClose={() => setShowClearModal(false)}
                    onConfirm={handleClearAllNotifications}
                />
            )}
        </div>
    );
};

export default NotificationComponent;