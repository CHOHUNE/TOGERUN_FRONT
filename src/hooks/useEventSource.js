// useEventSource.js
import {useEffect, useRef} from 'react';
import {getCookie} from '../util/cookieUtil';
import {useRecoilState} from 'recoil';
import {sseState} from '../atoms/sseState';
import useCustomLogin from './useCustomLogin';
import {EventSourcePolyfill, NativeEventSource} from "event-source-polyfill";

const useEventSource = (url, onMessage, onError, lastEventId) => {
    const {loginState} = useCustomLogin();
    const [isConnected, setIsConnected] = useRecoilState(sseState);
    const eventSourceRef = useRef(null);

    const EventSource = EventSourcePolyfill || NativeEventSource;

    useEffect(() => {
        if (loginState.email && !isConnected) {
            const accessToken = getCookie('member').accessToken;

            if (!accessToken) {
                console.error('AccessToken is not found');
                return;
            }


            eventSourceRef.current = new EventSource(`${url}`, {

                    headers: {
                        Authorization: `Bearer ${accessToken}`,

                    },
                    // withCredentials: true 쿠키를 죄다 보내서 일단 주석 처리
                }
            );


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
    }, [url, lastEventId, loginState]);

    return {isConnected};
};

export default useEventSource;