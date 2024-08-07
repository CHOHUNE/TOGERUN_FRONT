import axios from "axios";
import jwtAxios from "../util/JwtUtil";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api'
    //추후 배포시 baseURL 만 변경 해준다
})

export const getList = async (pageParams) => {

    const {page, size} = pageParams;

    const res = await jwtAxios.get(`/post/list`, {params: {page, size}})

    return res.data
}

export const postAdd = async (post) => {

    const response = await jwtAxios.postForm('/post', post)

    return response.data
}

export const deleteOne = async (postId) => {
    const response = await jwtAxios.delete(`/post/${postId}`)
    return response.data
}

export const putOne = async (postId,post) => {
    const response = await jwtAxios.putForm(`/post/${postId}`, post)
    return response.data

}

export const getOne= async (postId) => {
    const response = await jwtAxios.get(`/post/${postId}`)
    return response.data
}


export const getChatRoom = async(postId)=>{
    const response = await jwtAxios.get(`/post/${postId}/chat`);

    return response.data
}

export const deleteCommentAPI = async(commentId)=>{
    const response = await jwtAxios.delete(`/comment/${commentId}`);
    return response.data
}

export const fetchCommentList = async (postId) =>{
    const response = await jwtAxios.get(`/comment/${postId}`);
    return response.data
}

export const addCommentAPI =async ( newComment)=>{
    const response = await jwtAxios.post(`/comment`,newComment);
    return response.data
}

export const modifyCommentAPI = async (editedComment)=>{
    const response = await jwtAxios.put(`/comment`,editedComment);
    return response.data
}

export const likeToggle =async (postId)=>{
    const response = await jwtAxios.post(`/post/${postId}/like`);

    return response.data
}

export const favoriteToggle = async (postId)=>{
    const response = await jwtAxios.post(`/post/${postId}/favorite`);

    return response.data
}





