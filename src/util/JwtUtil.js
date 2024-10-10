import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { axiosInstance } from "../api/api";

const jwtAxios = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true
});

const refreshJWT = async (accessToken) => {
    const header = { headers: { "Authorization": `Bearer ${accessToken}` } };
    const res = await axiosInstance.get(`/member/refresh`, header);
    return res.data;
};

const beforeReq = (config) => {
    const memberInfo = getCookie('member');

    if (!memberInfo) {
        console.log("Member NOT FOUND");
        return Promise.reject({
            response: {
                data: {
                    status: "UNAUTHORIZED",
                    message: "로그인이 필요합니다.",
                    redirect: '/member/login',
                    errorStatus: "AUTHENTICATION_REQUIRED"
                }
            }
        });
    }

    const { accessToken } = memberInfo;
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
};

const requestFail = (err) => {
    console.log(".....request error occur.....");
    return Promise.reject(err);
};

const beforeRes = async (res) => {
    console.log("before return response...........");

    const data = res.data;

    if (data && data.errorStatus === 'ERROR_ACCESS_TOKEN') {
        const memberCookieValue = getCookie("member");
        const result = await refreshJWT(memberCookieValue.accessToken);
        console.log("refreshJWT RESULT", result);

        memberCookieValue.accessToken = result.accessToken;
        setCookie("member", JSON.stringify(memberCookieValue), 1);

        const originalRequest = res.config;
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

        return axiosInstance(originalRequest);
    }

    return res;
};

const responseFail = (err) => {
    console.log(".....response fail error .....");

    if (err.response && err.response.data) {
        const { status, message, redirect, errorStatus } = err.response.data;

        console.error(`Error: ${errorStatus}, Message: ${message}`);

        switch (errorStatus) {
            case "AUTHENTICATION_REQUIRED":
                window.location.href=redirect || '/member/login';
                break;
            case "AUTHENTICATION_FAILED":
                window.location.href = redirect || '/member/login';
                break;
            case "ACCESS_DENIED":
                window.location.href = redirect || '/';
                break;
            case "NEED_PROFILE_UPDATE":
                window.location.href = redirect || '/member/modify';
                break;
            case "INSUFFICIENT_AUTHENTICATION":
                window.location.href = redirect || '/member/login';
                break;
            default:
                console.error('Unhandled error:', message);
                window.location.href = redirect || '/';
        }
    } else {
        console.error('Unexpected error:', err);
        window.location.href = '/error';
    }

    return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;

// 외부 웹사이트로 이동하거나 전체 페이지 새로고침이 필요한 경우 window.location.href를 사용합니다.
// React 애플리케이션 내부에서 페이지 간 이동을 할 때는 navigate 함수를 사용하는 것이 좋지만,
// 오류 처리의 경우 React 컴포넌트 컨텍스트 밖에서 동작해야 하기 때문에
// 전체 페이지 새로 고침 후 navigate를 이용하는 것이 더 적절합니다.