import axios from "axios";
import {getCookie} from "./cookieUtil";


const jwtAxios = axios.create({
    baseURL: 'http://localhost:8080/api'
})



const beforeReq =(config)=>{
    console.log(".....before request.....")

    const memberInfo = getCookie('member')

    if (!memberInfo) {
        console.log("....member NOT FOUND")
        return Promise.reject(
            {
                response:{data :{error:"REQUIRE_LOGIN"}}
            }
        )
    }

    const {accessToken} = memberInfo
    console.log("accessToken",accessToken)
    config.headers.Authorization =`Bearer ${accessToken}`

    return config
}

const requestFail = (err)=>{
    console.log(".....request error occur.....")
    return Promise.reject(err)
}

const beforeRes = async (res)=>{
    console.log(".....before return response.....")

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
