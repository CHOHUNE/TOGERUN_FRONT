import jwtAxios from "../util/JwtUtil";
import {axiosInstance} from "./api";

export const joinChatRoom = async (postId) => {
    await jwtAxios.post(`/post/${postId}/chat/join`, null, {
    });
};

export const getChatRoom = async (postId) => {
    const response = await axiosInstance.get(`/post/${postId}/chat`);
    return response.data
}

export const leaveChatRoom = async (postId) => {
    const response = await jwtAxios.post(`/post/${postId}/chat/leave`);
    return response.data;
}

export const getChatRoomStatus = async (postId) => {
    const response = await jwtAxios.get(`/post/${postId}/chat/status`);
    return response.data;
}

