import {configureStore} from "@reduxjs/toolkit";
import chatSlice from "../slice/chatSlice";
import postSlice from "../slice/postSlice";
import userSlice from "../slice/userSlice";

const Store =configureStore( {

    reducer:{
        "user":userSlice,
        "post":postSlice,
        "chat":chatSlice,
    }

})


export default Store;