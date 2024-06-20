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
            return state.email = action.payload.email
        },
        logout: (state, action) => {
            console.log("............")
            console.log("logout......")
            console.log("............")

            state.email = {...initState}
        }

    }
})

export const {login, logout} = loginSlice.actions
export default loginSlice.reducer