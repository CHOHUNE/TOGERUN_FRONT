import axios from "axios";
import {getCookie, setCookie} from "./cookieUtil";
import {axiosInstance} from "../api/api";


const jwtAxios = axios.create({
    baseURL: 'http://localhost:8080/api'
})

const refreshJWT = async (accessToken) => {
    const header = {headers: {"Authorization": `Bearer ${accessToken}`}}
    const res = await axiosInstance.get(`/member/refresh`, header)
    return res.data
}


const beforeReq = (config)=>{
    // console.log("----- before Request -----")

    const memberInfo = getCookie('member')
    // console.log("memberinfo",memberInfo)

    if (!memberInfo) {
        console.log("Member NOT FOUND")
        return Promise.reject(
            {
                response:{ data: { error:"REQUIRE_LOGIN"} }
            }
        )
    }

    const {accessToken} =memberInfo
    // console.log("accessToken",accessToken)

    config.headers.Authorization = `Bearer ${accessToken}`

    return config

}

const requestFail = (err)=>{
    console.log(".....request error occur.....")
    return Promise.reject(err)
}

const beforeRes = async (res) => {
    console.log("before return response...........")

    //console.log(res)

    //'ERROR_ACCESS_TOKEN'
    const data = res.data

    if (data && data.error === 'ERROR_ACCESS_TOKEN') {

        const memberCookieValue = getCookie("member")

        const result = await refreshJWT(memberCookieValue.accessToken)
        console.log("refreshJWT RESULT", result)

        memberCookieValue.accessToken = result.accessToken
        // memberCookieValue.refreshToken = result.refreshToken

        setCookie("member", JSON.stringify(memberCookieValue), 1)

        //원래의 호출
        const originalRequest = res.config

        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`

        return axiosInstance(originalRequest)

    }

    return res
}

const responseFail =(err)=>{
    console.log(".....response fail error .....")

    return Promise.reject(err)
}

jwtAxios.interceptors.request.use(beforeReq,requestFail)
jwtAxios.interceptors.response.use(beforeRes,responseFail)


/*
interceptors.request.use
interceptors.response.use
는 각각 두 개의 인자를 받는데 요청 전, 요청 후를 가로채서 수행 할 동작을 받는다.
*/

export default jwtAxios
