import {configureStore} from "@reduxjs/toolkit";
import chatSlice from "../slice/chatSlice";
import postSlice from "../slice/postSlice";
import loginSlice from "../slice/loginSlice";

const Store = configureStore({

    reducer: {
        "loginSlice":loginSlice,
        "postSlice": postSlice,
        "chatSlice": chatSlice,

    }

})


export default Store;