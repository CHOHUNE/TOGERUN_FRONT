import jwtAxios from "../util/JwtUtil";

export const joinChatRoom = async (postId) => {
    await jwtAxios.post(`/post/${postId}/chat/join`, null, {
    });
};

export const getChatRoom = async (postId) => {
    const response = await jwtAxios.get(`/post/${postId}/chat`);
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

export const getJoinedChatRoom = async () => {
    const response = await jwtAxios.get(`/user/joined`);
    return response.data;
}
