import {configureStore} from "@reduxjs/toolkit";
import chatSlice from "../slice/chatSlice";

const Store = configureStore({

    reducer: {
        // "loginSlice":loginSlice,
        // "postSlice": postSlice,
        "chatSlice": chatSlice,

    }

})


export default Store;