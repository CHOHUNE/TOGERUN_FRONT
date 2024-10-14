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
        <div className="relative" ref={notificationRef}>
            <button
                onClick={toggleNotifications}
                className="btn btn-ghost btn-circle hover:bg-base-200"
            >
                <div className="indicator">
                    <BellIcon className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="badge badge-xs badge-primary indicator-item">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </button>

            {showNotifications && (
                <div className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-[90vw] sm:w-80 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto fixed sm:absolute left-1/2 sm:left-auto right-auto sm:right-0 -translate-x-1/2 sm:translate-x-0 top-[60px] sm:top-auto sm:mt-2 z-[100]">
                    <div className="flex flex-col">
                        {isLoading ? (
                            <p className="text-center py-4">로딩 중...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-center py-4">알림이 없습니다.</p>
                        ) : (
                            <>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-base-200 cursor-pointer ${
                                            notification.isRead ? 'bg-base-200' : 'bg-base-100'
                                        }`}
                                        onClick={() => markAsRead(notification)}
                                    >
                                        <p className="text-sm mb-2">{notification.content}</p>
                                        <p className="text-xs text-base-content/60">{new Date(notification.createdAt).toLocaleString()}</p>
                                    </div>
                                ))}
                                <div className="flex justify-between p-3 border-t border-base-300 mt-2">
                                    {hasNextPage && (
                                        <button
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                            className="btn btn-ghost btn-sm sm:btn-xs"
                                        >
                                            {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowClearModal(true)}
                                        className="btn btn-ghost btn-sm sm:btn-xs text-error"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[200]">
                    <CustomModal
                        title="알림 모두 읽기"
                        content="모든 알림을 읽음 처리하시겠습니까?"
                        onClose={() => setShowClearModal(false)}
                        onConfirm={handleClearAllNotifications}
                    />
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;