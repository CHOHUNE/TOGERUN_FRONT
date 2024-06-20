import {createSlice} from "@reduxjs/toolkit";


const initState = {
    email: ''
}


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

    }
})

export const {login, logout} = loginSlice.actions
export default loginSlice.reducer