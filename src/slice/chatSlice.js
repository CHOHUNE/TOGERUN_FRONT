import { createSlice} from "@reduxjs/toolkit";
import {fetchChatRooms, fetchMessages} from "../api/api";



export const chatSlice = createSlice({

name:'chat',
    initialState:{
    chatRooms:[],
        messages:[],
        status:null,
    },
    extraReducers:(builder)=>{
    builder.addCase(fetchChatRooms.fulfilled,(state,action)=>{
            state.status='succeeded'
            state.chatRooms=action.payload
        })
        builder.addCase(fetchMessages.fulfilled,(state,action)=>{
            state.status='succeeded'
            state.status=action.payload
        })
    }
})

export default chatSlice.reducer