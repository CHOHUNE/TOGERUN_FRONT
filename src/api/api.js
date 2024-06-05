import axios, {post} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";

const axiosInstance= axios.create({
    baseURL:'http://localhost:8080/api'
})

export const fetchChatRooms = createAsyncThunk('chat/fetchChatRooms', async () => {
    const response = await axiosInstance.get('/chats/rooms')

    return response.data
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (chatRoomId) => {
    const response = await axiosInstance.get(`/chats/rooms/${chatRoomId}/messages`)

    return response.data
});

export const fetchPosts= createAsyncThunk('post/fetchPosts',async()=>{
    const response = await axiosInstance.get('/posts');
    return response.data;

})

export const fetchPostById = createAsyncThunk('post/fetchPostById',async (postId)=>{
    const response = await axiosInstance.get(`/posts/${postId}`)

    return response.data
})

export const createPost = createAsyncThunk ('posts/createPost' , async (post)=>{
    const response = await axiosInstance.post('/posts',post )
    return response.data
})

