import jwtAxios from "../util/JwtUtil";
import {axiosInstance} from "./api";

export const getList = async (pageParams) => {
    const {page, size, keyword,region,activityType} = pageParams;
    const res = await axiosInstance.get(`/post/list`, {params: {page, size, keyword,region,activityType}})
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

export const putOne = async (postId, post) => {
    const response = await jwtAxios.putForm(`/post/${postId}`, post)
    return response.data
}

export const getOne = async (postId) => {
    const response = await axiosInstance.get(`/post/${postId}`)
    return response.data
}

export const favoriteToggle = async (postId) => {
    const response = await jwtAxios.post(`/post/${postId}/favorite`);
    return response.data
}