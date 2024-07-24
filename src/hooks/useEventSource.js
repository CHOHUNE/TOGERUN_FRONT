// useEventSource.js
import { useEffect, useRef } from 'react';
import { getCookie } from '../util/cookieUtil';
import { useRecoilState } from 'recoil';
import { sseState } from '../atoms/sseState';
import useCustomLogin from './useCustomLogin';

const useEventSource = (url, onMessage, onError, lastEventId) => {
    const { loginState } = useCustomLogin();
    const [isConnected, setIsConnected] = useRecoilState(sseState);
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (loginState.email && !isConnected) {
            const memberCookie = getCookie('member');
            if (!memberCookie || !memberCookie.accessToken) {
                console.error('No valid token found in cookies');
                return;
            }

            const token = memberCookie.accessToken;
            eventSourceRef.current = new EventSource(`${url}?lastEventId=${lastEventId}&token=${token}`);

            eventSourceRef.current.onmessage = (event) => {
                if (onMessage) {
                    onMessage(event);
                }
            };

            eventSourceRef.current.onerror = (error) => {
                if (onError) {
                    onError(error);
                }
                eventSourceRef.current.close();
                setIsConnected(false);
            };

            setIsConnected(true);
        } else if (!loginState.email && isConnected) {
            // 로그아웃 시 SSE 연결 종료
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                setIsConnected(false);
            }
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                setIsConnected(false);
            }
        };
    }, [url, onMessage, onError, lastEventId, loginState, isConnected, setIsConnected]);

    return { isConnected };
};

export default useEventSource;