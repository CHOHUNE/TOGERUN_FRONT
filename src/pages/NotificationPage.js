import React, { useEffect, useState } from 'react';
import jwtAxios from "../util/JwtUtil";

function NotificationPage(props) {
    // Step 1: Define state for storing data
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        jwtAxios.get('/notifications/subscribe/1')
            .then(response => {
                // Step 2: Store fetched data in state
                setNotifications(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    // Step 3: Display data
    return (
        <div>
            NotificationPage

                {notifications.id}
                {notifications.event}
                {notifications.data}

        </div>
    );
}

export default NotificationPage;