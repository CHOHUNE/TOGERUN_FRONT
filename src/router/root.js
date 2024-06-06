import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import PostList from "../component/PostList";


const Loading = <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>

const PostDetail = lazy(() => import("../component/PostDetail"));
const ChatRoom = lazy(() => import("../component/ChatRoom"));
const CreatePostForm = lazy(() => import("../component/CreatePostForm"));

const root = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={Loading}><PostList/></Suspense>

    }, {
        path: "posts/:postId",
        element: <Suspense fallback={Loading}><PostDetail/></Suspense>
    }, {
        path: "chats/:chatRoomId",
        element: <Suspense fallback={Loading}><ChatRoom/></Suspense>
    },{
    path:"/post",
        element:<Suspense fallback={Loading}><CreatePostForm/></Suspense>
    }
])


export default root