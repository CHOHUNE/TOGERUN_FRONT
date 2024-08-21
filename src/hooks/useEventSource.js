import { useState, useEffect, useRef, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { notificationState } from '../atoms/notificationState';
import useCustomLogin from './useCustomLogin';
import { EventSourcePolyfill } from "event-source-polyfill";
import { getCookie } from '../util/cookieUtil';

const useEventSource = (url, onMessage) => {
    const { loginState } = useCustomLogin();
    const [notificationExist, setNotificationExist] = useRecoilState(notificationState);
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const retryCount = useRef(0);

    const connect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const accessToken = getCookie('member')?.accessToken;
        if (!accessToken) {
            console.error('AccessToken is not found');
            return;
        }

        eventSourceRef.current = new EventSourcePolyfill(`${url}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            heartbeatTimeout: 300000,
        });

        eventSourceRef.current.onopen = () => {
            console.log("SSE Connection Opened");
            setIsConnected(true);
            setNotificationExist(true);
            retryCount.current = 0;
        };

        eventSourceRef.current.onerror = (error) => {
            console.log('SSE Error', error);
            eventSourceRef.current.close();
            setIsConnected(false);
            setNotificationExist(false);
            scheduleReconnect();
        };

        eventSourceRef.current.addEventListener('sse', (event) => {
            const { data } = event;
            console.log('SSE EVENT', data);

            if (!data.includes(`EventStream Created`)) {
                setNotificationExist(true);
            }

            if (onMessage) {
                onMessage(event);
            }
        });
    }, [url, onMessage, setNotificationExist]);

    const scheduleReconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        const delay = Math.min(1000 * (2 ** retryCount.current), 30000); // 최대 30초
        reconnectTimeoutRef.current = setTimeout(() => {
            retryCount.current++;
            connect();
        }, delay);
    }, [connect]);

    useEffect(() => {
        if (loginState.email) {
            connect();
        } else {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                setIsConnected(false);
                setNotificationExist(false);
            }
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            setIsConnected(false);
            setNotificationExist(false);
        };
    }, [loginState, connect, setNotificationExist]);

    // 주기적으로 연결 상태 체크
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (loginState.email && !isConnected) {
                console.log("Connection check: Reconnecting...");
                connect();
            }
        }, 60000); // 1분마다 체크

        return () => clearInterval(intervalId);
    }, [loginState, isConnected, connect]);

    // 사용자 액션(예: 페이지 포커스)에 따른 재연결
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && loginState.email && !isConnected) {
                console.log("Page visible: Reconnecting...");
                connect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [loginState, isConnected, connect]);

    // 수동 재연결 함수
    const manualReconnect = useCallback(() => {
        if (loginState.email) {
            console.log("Manual reconnection initiated");
            connect();
        }
    }, [loginState, connect]);

    return { isConnected, manualReconnect };
};

export default useEventSource;