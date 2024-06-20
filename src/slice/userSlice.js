import React from 'react';
import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({

    name: 'user',
    initialState: {
        user: null,
    },
    reducers: {
        setUsers: (state, action) => {
            state.user = action.payload
        }
    }
})

export const {setUser} = userSlice.actions
export default userSlice.reducer;