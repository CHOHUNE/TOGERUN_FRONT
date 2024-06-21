import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loginPost} from "../api/memberApi";
import {setCookie} from "../util/cookieUtil";


const initState = {
    email: ''
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => loginPost(param));


const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: initState,
    reducers: {
        login: (state, action) => {
            console.log("............")
            console.log("login......")
            console.log("action.payload.email", action.payload.email);
            console.log("............")
            console.log("action.payload", action.payload);
            console.log("............")

            state.email = action.payload.email
            // return state.email = action.payload.email
            //     여기서 return 문을 쓰면 redux 는 이를 새 상태로 간주한다. 동시에 기존의 초안을 동시에 수정하려고 하면 오류가 발생한다
            //  [Immer] An immer producer returned a new value and modified its draft. Either return a new value or modify the draft.
            // 따라서 여기에선 return 문을 쓰면 안되고 return 문을 쓰려면 아예 새 상태를 반환해야 한다.

            /*
            * return {
            * ...state,
            *  email: action.payload.email
            * }
            * */


        },
        logout: (state, action) => {
            console.log("............")
            console.log("logout......")
            console.log("action.payload", action.payload);
            console.log("............")

            state.email = {...initState}
        }
    }, extraReducers: (builder) => {
        builder.addCase(loginPostAsync.fulfilled, (state, action) => {

            const payload = action.payload
            console.log("............login fulfilled............")
            console.log("action.payload", payload);
            console.log("........................")

            if (!payload.error) {
                setCookie("member", JSON.stringify(payload), 1);

            }

            console.log("............Cookie set complete............")



            return action.payload;

        })
            .addCase(loginPostAsync.pending,(state,action)=>{
                console.log("pending")
            }).addCase(loginPostAsync.rejected,(state,action)=>{
            console.log("rejected")
        })
    }
})

export const {login, logout} = loginSlice.actions
export default loginSlice.reducer