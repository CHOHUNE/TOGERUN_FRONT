import jwtAxios from "../util/JwtUtil";

export const deleteCommentAPI = async (commentId) => {
    const response = await jwtAxios.delete(`/comment/${commentId}`);
    return response.data
}

export const fetchCommentList = async (postId) => {
    const response = await jwtAxios.get(`/comment/${postId}`);
    return response.data
}

export const addCommentAPI = async (newComment) => {
    const response = await jwtAxios.post(`/comment`, newComment);
    return response.data
}

export const modifyCommentAPI = async (editedComment) => {
    const response = await jwtAxios.put(`/comment`, editedComment);
    return response.data
}