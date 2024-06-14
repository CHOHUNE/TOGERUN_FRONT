import {createSlice} from '@reduxjs/toolkit';
import {createPost, fetchPostById, fetchPosts} from '../api/api';

export const postSlice = createSlice({
    name: 'post',
    initialState: {
        serverData: {
            dtoList: [],
            pageNumList: [],
            pageRequestDTO: null,
            prev: false,
            next: false,
            totalCount: 0,
            prevPage: 0,
            nextPage: 0,
            totalPage: 0,
            current: 0
        },
    },
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.serverData = action.payload;
        });
        builder.addCase(fetchPostById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.serverData.dtoList = Array.isArray(action.payload) ? action.payload : [action.payload];
        });
        builder.addCase(createPost.fulfilled, (state, action) => {
            state.status = 'succeeded';


        });
    },
});

export default postSlice.reducer;
