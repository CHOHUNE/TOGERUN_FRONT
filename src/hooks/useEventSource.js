import { useEffect, useRef } from 'react';
import { getCookie } from '../util/cookieUtil';
import { useRecoilState } from 'recoil';
import { notificationState } from '../atoms/notificationState';
import useCustomLogin from './useCustomLogin';
import { EventSourcePolyfill } from "event-source-polyfill";

const useEventSource = (url, onMessage) => {
    const { loginState } = useCustomLogin();
    const [notificationExist, setNotificationExist] = useRecoilState(notificationState);
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (loginState.email) {
            const accessToken = getCookie('member').accessToken;

            if (!accessToken) {
                console.error('AccessToken is not found');
                return;
            }

            eventSourceRef.current = new EventSourcePolyfill(`${url}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // eventSourceRef.current.onmessage = (event) => {
            //     console.log('SSE Message Received:', event.data);
            //     if (onMessage) {
            //         onMessage(event);
            //     }
            // };

            eventSourceRef.current.addEventListener('sse', (event) => {
                const { data } = event;
                console.log('SSE EVENT', data);

                if (!data.includes(`EventStream Created`)) {
                    setNotificationExist(false);
                }

                if (onMessage) {
                    onMessage(event);
                }
            });

            eventSourceRef.current.onopen = () => console.log("SSE Connection Opened");

            eventSourceRef.current.onerror = (error) => {
                console.log('SSE Error', error);
                eventSourceRef.current.close();
                setNotificationExist(false);
            };

            setNotificationExist(true);
        } else if (!loginState.email && notificationExist) {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                setNotificationExist(false);
            }
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                setNotificationExist(false);
            }
        };
    }, [url, loginState, onMessage, setNotificationExist]);
};

export default useEventSource;