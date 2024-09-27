import React, {lazy, Suspense} from "react";


const Loading = <div className={"loading loading-spinner loading-lg"}/>

const Login = lazy(() => import("../pages/member/LoginPage"));

const MemberModify = lazy(() => import("../pages/member/MemberModifyPage"));

const AdminPage = lazy(() => import("../pages/member/AdminPage"));

const RestorePage = lazy(()=>import("../pages/member/RestorePage"));

const memberRouter = () => {

    return [{
        path: "login",
        element: <Suspense fallback={Loading}><Login/></Suspense>
    }
    ,{
        path:"modify",
        element: <Suspense fallback={Loading}><MemberModify/></Suspense>
    },{
        path:"admin",
            element: <Suspense fallback={Loading}><AdminPage/></Suspense>
        },{
        path:"restore/:userId"
            ,element: <Suspense fallback={Loading}><RestorePage/></Suspense>
        }]
}

export default memberRouter
