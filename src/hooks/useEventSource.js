import { useEffect } from 'react';
import { getCookie } from '../util/cookieUtil';
import { useRecoilState } from 'recoil';
import { sseState } from '../atoms/sseState';
import useCustomLogin from './useCustomLogin';

const useEventSource = (url, onMessage, onError, lastEventId) => {
    const { loginState } = useCustomLogin();
    const [isConnected, setIsConnected] = useRecoilState(sseState);  // Recoil 상태 사용

    useEffect(() => {
        if (loginState && !isConnected) {

            const memberCookie = getCookie('member');

            if (!memberCookie || !memberCookie.accessToken) {
                console.error('No valid token found in cookies');
                return;
            }

            const token = memberCookie.accessToken;
            const eventSource = new EventSource(`${url}?lastEventId=${lastEventId}&token=${token}`);

            eventSource.onmessage = (event) => {
                if (onMessage) {
                    onMessage(event);
                }
            };

            eventSource.onerror = (error) => {
                if (onError) {
                    onError(error);
                }
                eventSource.close();
            };

            setIsConnected(true);  // Recoil 상태 업데이트

            return () => {
                eventSource.close();
                setIsConnected(false);  // 컴포넌트 언마운트 시 Recoil 상태 초기화
            };
        }
    }, [url, lastEventId, loginState]);
};

export default useEventSource;
