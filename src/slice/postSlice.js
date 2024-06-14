import {createSlice} from '@reduxjs/toolkit';
import {createPost, fetchPostById, fetchPosts} from '../api/api';

export const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        post: {
            id:0,
            title:''
            ,user:''
            ,localDate:''
            ,content:''
        },
    },
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.posts = action.payload;
        });
        builder.addCase(fetchPostById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.post = action.payload;
        });
        builder.addCase(createPost.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.posts = [...state.posts, action.payload]; // 불변성을 유지하면서 새로운 배열을 반환
        });
    },
});

export default postSlice.reducer;
