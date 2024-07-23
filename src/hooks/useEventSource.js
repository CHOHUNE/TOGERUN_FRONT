import { useEffect } from 'react';

const useEventSource = (url, onMessage, onError) => {
    useEffect(() => {
        const eventSource = new EventSource(url);

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

        return () => {
            eventSource.close();
        };
    }, [url, onMessage, onError]);
};

export default useEventSource;
