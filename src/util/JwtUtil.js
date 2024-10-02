import axios from "axios";
import {getCookie, setCookie} from "./cookieUtil";
import {axiosInstance} from "../api/api";
import {useSetRecoilState} from "recoil";
import {modalState} from "../atoms/modalState";

const jwtAxios = axios.create({
    baseURL: 'http://localhost:8080/api'
})

const refreshJWT = async (accessToken) => {
    const header = {headers: {"Authorization": `Bearer ${accessToken}`}}
    const res = await axiosInstance.get(`/member/refresh`, header)
    return res.data
}

const beforeReq = (config) => {
    const memberInfo = getCookie('member')

    if (!memberInfo) {
        console.log("Member NOT FOUND")
        return Promise.reject({
            response: { data: { error: "REQUIRE_LOGIN" } }
        })
    }

    const {accessToken} = memberInfo
    config.headers.Authorization = `Bearer ${accessToken}`

    return config
}

const requestFail = (err) => {
    console.log(".....request error occur.....")
    return Promise.reject(err)
}

const beforeRes = async (res) => {
    console.log("before return response...........")

    const data = res.data

    if (data && data.error === 'ERROR_ACCESS_TOKEN') {
        const memberCookieValue = getCookie("member")
        const result = await refreshJWT(memberCookieValue.accessToken)
        console.log("refreshJWT RESULT", result)

        memberCookieValue.accessToken = result.accessToken
        setCookie("member", JSON.stringify(memberCookieValue), 1)

        const originalRequest = res.config
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`

        return axiosInstance(originalRequest)
    }

    return res
}

const responseFail = (err,setModalState) => {
    console.log(".....response fail error .....")

    if (err.response && err.response.status === 403) {
        const data = err.response.data;
        if (data.status === 'NEED_PROFILE_UPDATE') {
            console.log('Profile update required.');
            setModalState({
                isOpen: true,
                title: "프로필 업데이트 필요",
                content: "회원가입 정보를 전부 기입 완료해 주십시오.",
                callbackFn: () => {
                    window.location.href = data.redirectUrl;
                }
            });
        } else if (data.status === 'ACCESS_DENIED') {
            console.error('Access denied:', data.message);
            // 여기에 접근 거부에 대한 추가 처리를 구현할 수 있습니다.
            // 예: 알림 표시, 특정 페이지로 리다이렉트 등
        }
    }

    return Promise.reject(err)
}

const useJwtAxios = () => {

}

jwtAxios.interceptors.request.use(beforeReq, requestFail)
jwtAxios.interceptors.response.use(beforeRes, responseFail)

export default jwtAxios