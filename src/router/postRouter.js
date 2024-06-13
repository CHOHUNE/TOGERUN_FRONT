import React, {lazy, Suspense} from 'react';
import {createBrowserRouter} from "react-router-dom";




    const Loading = () => <div className={"loading loading-spinner loading-lg"}/>

    const PostDetail = lazy(() => import("../pages/Post/ReadPage"));
    const ChatRoom = lazy(() => import("../pages/Post/ChatRoomPage"));
    const CreatePostForm = lazy(() => import("../component/CreatePostForm"));
    const ListPage = lazy(() => import("../pages/Post/ListPage"));

    const postRouter =()=>{
        return [{

            path: "list",
            element: <Suspense fallback={Loading}><ListPage/></Suspense>
        },
            {
                path: ":postId",
                element: <Suspense fallback={Loading}><PostDetail/></Suspense>
            },
            {
                path: "chat/:chatRoomId",
                element: <Suspense fallback={Loading}><ChatRoom/></Suspense>
            },{
                path:"write",
                element:<Suspense fallback={Loading}><CreatePostForm/></Suspense>
            }
        ]
    }

export default  postRouter