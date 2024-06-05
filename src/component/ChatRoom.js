import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import SockJS from 'sockjs-client';

import message from "sockjs-client/lib/transport/lib/buffered-sender.js";
import {Stomp} from "@stomp/stompjs";
import {fetchMessages} from "../api/api";

const ChatRoom = () => {

    const {chatRoomId} = useParams();
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.message);

    const [newMessage, setNewMessage] = useState(' ')
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        dispatch(fetchMessages(chatRoomId))

        const socket = new SockJS('http://localhost:8080/ws')
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/messages', (message) => {
                dispatch(fetchMessages(chatRoomId))

            })
        })

        setStompClient(stompClient)

        return () => {
            if (stompClient) {
                stompClient.disconnect()
            }
        }

    }, [dispatch, chatRoomId]);


    const sendMessage = async () => {
        if (stompClient && newMessage) {

        }

        return (
            <div>
                Chat Room
                <div>
                    {messages.map((messages) => (
                        <div key={message.id}>
                          {message.sender.username}
                            {message.content}
                        </div>
                    ))}
                    <input
                        type={"text"}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}/>
                </div>
                <button onClick={sendMessage}>Send</button>
            </div>
        );
    }
}
export default ChatRoom;