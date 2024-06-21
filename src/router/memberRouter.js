import React, {lazy, Suspense} from "react";

const Loading = <div className={"loading loading-spinner loading-lg"}/>

const Login = lazy(() => import("../pages/member/LoginPage"));

const Logout = lazy(() => import("../pages/member/LogoutPage"));

const KakaoRedirect = lazy(()=> import("../pages/member/KakaoRedirectPage"))

const memberRouter = () => {

    return [{
        path: "login",
        element: <Suspense fallback={Loading}><Login/></Suspense>
    }, {
        path: "logout",
        element: <Suspense fallback={Loading}><Logout/></Suspense>
    },{
        path: "kakao",
        element: <Suspense fallback={Loading}><KakaoRedirect/></Suspense>
    }]
}

export default memberRouter
