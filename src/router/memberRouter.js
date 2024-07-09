import React, {lazy, Suspense} from "react";

const Loading = <div className={"loading loading-spinner loading-lg"}/>

const Login = lazy(() => import("../pages/member/LoginPage"));

const Logout = lazy(() => import("../pages/member/LogoutPage"));

const MemberModify = lazy(() => import("../pages/member/MemberModifyPage"));


const memberRouter = () => {

    return [{
        path: "login",
        element: <Suspense fallback={Loading}><Login/></Suspense>
    }, {
        path: "logout",
        element: <Suspense fallback={Loading}><Logout/></Suspense>
    }
    ,{
        path:"modify",
        element: <Suspense fallback={Loading}><MemberModify/></Suspense>
    }]
}

export default memberRouter
