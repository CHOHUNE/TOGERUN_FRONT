import axios, {post} from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";

const axiosInstance= axios.create({
    baseURL:'http://localhost:8080/api'
})

// export const getList = async(pageParams) =>{
//
//     const {page,size} = pageParams;
//
//     const res = await axiosInstance.get(`/posts`, {params:{page,size}})
//
//     return res.data
// }


export const fetchChatRooms = createAsyncThunk('chats/fetchChatRooms', async (chatRoomId) => {
    const response = await axiosInstance.get(`/chats/${chatRoomId}/`)

    return response.data
});

export const fetchMessages = createAsyncThunk('chats/fetchMessages', async (chatRoomId) => {
    const response = await axiosInstance.get(`/chats`)

    return response.data
});


export const fetchPosts= createAsyncThunk('post/fetchPosts',async(pageParams)=>{
    const response = await axiosInstance.get('/posts');

    return response.data

})

export const fetchPostById = createAsyncThunk('posts/fetchPostById',async (postId)=>{
    const response = await axiosInstance.get(`/posts/${postId}`)

    return response.data
})

export const createPost = createAsyncThunk ('posts/createPost' , async (post)=>{
    const response = await axiosInstance.post('/posts',post )
    return response.data
})

