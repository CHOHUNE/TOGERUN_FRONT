import {createSlice} from "@reduxjs/toolkit";


const initState={
    email:''
}


const loginSlice = createSlice({
    name:'loginSlice',
    initialState:initState,
    reducers:{
        login:(state,action)=>{
            state.email = action.payload
        },
        logout:(state,action)=>{
            state.email = ''
        }

    }
})

export const {login,logout} = loginSlice.actions
export default loginSlice.reducer