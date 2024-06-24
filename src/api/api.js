import axios, {post} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import jwtAxios from "../util/JwtUtil";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api'
})

export const getList = async (pageParams) => {

    const {page, size} = pageParams;

    const res = await jwtAxios.get(`/posts/list`, {params: {page, size}})

    return res.data
}

export const postAdd = async (post) => {

    const response = await jwtAxios.postForm('/posts', post)

    return response.data
}

export const deleteOne = async (id) => {
    const response = await jwtAxios.delete(`/posts/${id}`)
    return response.data
}

export const putOne = async (post) => {
    const response = await jwtAxios.put(`/posts/${post.id}`, post)
    return response.data

}


export const fetchChatRooms = createAsyncThunk('chats/fetchChatRooms', async (chatRoomId) => {
    const response = await jwtAxios.get(`/chats/${chatRoomId}/`)

    return response.data
});

export const fetchMessages = createAsyncThunk('chats/fetchMessages', async (chatRoomId) => {
    const response = await jwtAxios.get(`/chats`)

    return response.data
});


export const fetchPosts = createAsyncThunk('post/fetchPosts', async (pageParams) => {

    return getList(pageParams)

})

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`)

    return response.data
})


