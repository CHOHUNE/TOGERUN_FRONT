import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import PostIndexPage from "../pages/Post/IndexPage";
import postRouter from "./postRouter";
import memberRouter from "./memberRouter";


const Loading = <div className={"loading loading-spinner loading-lg"}/>


const Main = lazy(() => import("../pages/MainPage"));
const About = lazy(() => import("../pages/About"));
const Home = lazy(() => import("../pages/Home"));

const Notifications = lazy(()=>import("../pages/NotificationPage"));

const root = createBrowserRouter([
    {
        path: "/home",
        element: <Suspense fallback={Loading}><Home/></Suspense>

        // 추후에 적용할 접근시 보게될 첫 로그인 화면
    },
    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>

    },
    {
        path: "/about",
        element: <Suspense fallback={Loading}><About/></Suspense>
    },

    {
        path: "/post",
        element: <Suspense fallback={Loading}><PostIndexPage/></Suspense>,
        children: postRouter()

    }, {
        path: '/member',
        children: memberRouter()
    },{

    path:'/notifications/subscribe/:id',
        element:<Suspense fallback={Loading}><Notifications/></Suspense>
    }
])


export default root