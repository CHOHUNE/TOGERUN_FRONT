import React, {lazy, Suspense} from "react";

const Loading =  <div className={"loading loading-spinner loading-lg"}/>

const Login  = lazy(()=>import("../pages/member/LoginPage"));


const memberRouter =()=>{

    return [{
        path:"login",
        element:<Suspense fallback={Loading}><Login/></Suspense>
    }]
}

export default memberRouter
