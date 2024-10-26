/**
 * Server-Sent Events를 관리하는 커스텀 훅
 * EventSource 연결, 재연결, 에러 처리 등을 관리합니다.
 *
 * @param {string} url - SSE 엔드포인트 URL
 * @param {Function} onMessage - SSE 이벤트 메시지 처리 콜백 함수
 * @returns {Object} - isConnected: 연결 상태, manualReconnect: 수동 재연결 함수, retryCount: 재시도 횟수
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { notificationState } from '../atoms/notificationState';
import useCustomLogin from './useCustomLogin';
import { EventSourcePolyfill } from "event-source-polyfill";
import { getCookie } from '../util/cookieUtil';

const useEventSource = (url, onMessage) => {
    // 상태 관리
    const { loginState } = useCustomLogin();
    const [notificationExist, setNotificationExist] = useRecoilState(notificationState);
    const [isConnected, setIsConnected] = useState(false);

    // ref 관리
    const eventSourceRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const retryCount = useRef(0);

    /**
     * EventSource 연결 설정 및 이벤트 핸들러 등록
     */
    const connect = useCallback(() => {
        // 기존 연결이 있다면 종료
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        // 액세스 토큰 확인
        const accessToken = getCookie('member')?.accessToken;
        if (!accessToken) {
            console.error('AccessToken is not found');
            return;
        }

        // EventSource 인스턴스 생성 및 설정
        eventSourceRef.current = new EventSourcePolyfill(`${url}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Last-Event-ID': 'last-event-id'
            },
            heartbeatTimeout: 300000, // 5분
            withCredentials: true,    // CORS 자격 증명 포함
        });

        // 연결 성공 핸들러
        eventSourceRef.current.onopen = (event) => {
            console.log("SSE Connection Opened", event);
            setIsConnected(true);
            setNotificationExist(true);
            retryCount.current = 0;
        };

        // 에러 핸들러
        eventSourceRef.current.onerror = (error) => {
            console.log('SSE Error', error);
            eventSourceRef.current.close();
            setIsConnected(false);
            setNotificationExist(false);
            scheduleReconnect();
        };

        // SSE 이벤트 리스너
        eventSourceRef.current.addEventListener('sse', (event) => {
            try {
                const { data } = event;
                console.log('SSE EVENT:', data);

                // 초기 연결 메시지가 아닌 경우에만 알림 상태 업데이트
                if (!data.includes('EventStream Created')) {
                    setNotificationExist(true);
                }

                // 콜백 함수 실행
                if (onMessage) {
                    onMessage(event);
                }
            } catch (error) {
                console.error('Error processing SSE event:', error);
            }
        });
    }, [url, onMessage, setNotificationExist]);

    /**
     * 재연결 스케줄링
     * 지수 백오프 방식으로 재연결 시도 간격을 조절합니다.
     */
    const scheduleReconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        // 최대 재시도 횟수 제한
        const maxRetries = 5;
        if (retryCount.current >= maxRetries) {
            console.log('Maximum retry attempts reached');
            return;
        }

        // 지수 백오프로 딜레이 계산 (최대 30초)
        const delay = Math.min(1000 * (2 ** retryCount.current), 30000);
        console.log(`Scheduling reconnect in ${delay}ms, attempt ${retryCount.current + 1}/${maxRetries}`);

        reconnectTimeoutRef.current = setTimeout(() => {
            retryCount.current++;
            connect();
        }, delay);
    }, [connect]);

    /**
     * 로그인 상태에 따른 연결 관리
     */
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

        // 클린업 함수
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

    /**
     * 주기적 연결 상태 체크 (1분 간격)
     */
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (loginState.email && !isConnected) {
                console.log("Connection check: Reconnecting...");
                connect();
            }
        }, 60000);

        return () => clearInterval(intervalId);
    }, [loginState, isConnected, connect]);

    /**
     * 페이지 가시성 변경에 따른 재연결
     */
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

    /**
     * 수동 재연결 함수
     */
    const manualReconnect = useCallback(() => {
        if (loginState.email) {
            console.log("Manual reconnection initiated");
            connect();
        }
    }, [loginState, connect]);

    return {
        isConnected,
        manualReconnect,
        retryCount: retryCount.current
    };
};

export default useEventSource;