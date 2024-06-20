import axios, {post} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api'
})

export const getList = async (pageParams) => {

    const {page, size} = pageParams;

    const res = await axiosInstance.get(`/posts/list`, {params: {page, size}})

    return res.data
}

export const postAdd = async (post) => {
    const response = await axiosInstance.post('/posts', post)
    return response.data
}

export const deleteOne = async (id) => {
    const response = await axiosInstance.delete(`/posts/${id}`)
    return response.data
}

export const putOne = async (post) => {
    const response = await axiosInstance.put(`/posts/${post.id}`, post)
    return response.data

}


export const fetchChatRooms = createAsyncThunk('chats/fetchChatRooms', async (chatRoomId) => {
    const response = await axiosInstance.get(`/chats/${chatRoomId}/`)

    return response.data
});

export const fetchMessages = createAsyncThunk('chats/fetchMessages', async (chatRoomId) => {
    const response = await axiosInstance.get(`/chats`)

    return response.data
});


export const fetchPosts = createAsyncThunk('post/fetchPosts', async (pageParams) => {

    return getList(pageParams)

})

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`)

    return response.data
})


