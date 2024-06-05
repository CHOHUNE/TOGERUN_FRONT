import {createSlice} from "@reduxjs/toolkit";
import {createPost, fetchPostById, fetchPosts} from "../api/api";


export const postSlice = createSlice({

    name: 'post',
    initialState: {
        posts: [],
        post: null,
        status: null,

    },
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.fulfilled, (state, action) => {

            state.status = 'succeeded'
            state.posts = action.payload

        })
        builder.addCase(fetchPostById.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.post = action.payload
        })
        builder.addCase(createPost.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.posts.push =[...state.posts, action.payload];
        })
    }


})

export default postSlice.reducer