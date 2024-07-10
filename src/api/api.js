import axios from "axios";
import jwtAxios from "../util/JwtUtil";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api'
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





