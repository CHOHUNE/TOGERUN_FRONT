import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { axiosInstance } from "../api/api";

// 상수 분리
const API_BASE_URL = 'https://api.togerun.shop/api';
const FRONTEND_BASE_URL = 'https://www.togerun.shop';

// 에러 타입 상수화
const ERROR_TYPES = {
    AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    ACCESS_DENIED: 'ACCESS_DENIED',
    NEED_PROFILE_UPDATE: 'NEED_PROFILE_UPDATE',
    INSUFFICIENT_AUTHENTICATION: 'INSUFFICIENT_AUTHENTICATION',
    ERROR_ACCESS_TOKEN: 'ERROR_ACCESS_TOKEN'
};

// 리다이렉트 경로 상수화
const REDIRECT_PATHS = {
    LOGIN: '/member/login',
    ERROR: '/error',
    MODIFY: '/member/modify'
};

const jwtAxios = axios.create({
    baseURL: API_BASE_URL
});

const checkProfileCompletion = (memberInfo) => {
    // memberInfo가 없거나 필수 필드가 누락된 경우
    if (!memberInfo) return false;

    const { social, age, gender, mobile } = memberInfo;

    // social이 true이거나
    // age, gender가 없거나 빈 문자열이거나
    // mobile이 없거나 빈 문자열인 경우
    return social === true ||
        !age || age === '' ||
        !gender || gender === '' ||
        !mobile || mobile === '';
};

const handleAuthError = () => {
    console.log("Member NOT FOUND");
    return Promise.reject({
        response: {
            data: {
                status: "UNAUTHORIZED",
                message: "로그인이 필요합니다.",
                redirect: REDIRECT_PATHS.LOGIN,
                errorStatus: ERROR_TYPES.AUTHENTICATION_REQUIRED
            }
        }
    });
};

const beforeReq = (config) => {
    // 현재 페이지가 이미 수정 페이지인 경우 체크를 건너뜀
    if (window.location.pathname === REDIRECT_PATHS.MODIFY) {
        const memberInfo = getCookie('member');

        // 로그인 안해도 무방하게..
        // if (!memberInfo) return handleAuthError();

        const { accessToken } = memberInfo;
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    }

    const memberInfo = getCookie('member');

    // if (!memberInfo) return handleAuthError();
    // 로그인 안해도 무방하게

    // 프로필 완성도 체크
    if (checkProfileCompletion(memberInfo)) {
        return Promise.reject({
            response: {
                data: {
                    status: "REDIRECT",
                    message: "회원정보를 완성해주세요.",
                    redirect: REDIRECT_PATHS.MODIFY,
                    errorStatus: ERROR_TYPES.NEED_PROFILE_UPDATE
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

const handleTokenRefresh = async (res) => {
    const memberCookieValue = getCookie("member");
    const result = await refreshJWT(memberCookieValue.accessToken);

    memberCookieValue.accessToken = result.accessToken;
    setCookie("member", memberCookieValue, 6);

    const originalRequest = res.config;
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;

    return axiosInstance(originalRequest);
};

const beforeRes = async (res) => {
    const data = res.data;

    if (data?.errorStatus === ERROR_TYPES.ERROR_ACCESS_TOKEN) {
        return handleTokenRefresh(res);
    }
    return res;
};

const handleRedirect = (redirect, defaultPath) => {
    window.location.href = `${FRONTEND_BASE_URL}${redirect || defaultPath}`;
};

const handleErrorResponse = ({message, redirect, errorStatus}) => {
    console.error(`Error: ${errorStatus}, Message: ${message}`);

    switch (errorStatus) {
        case ERROR_TYPES.AUTHENTICATION_REQUIRED:
        case ERROR_TYPES.AUTHENTICATION_FAILED:
        case ERROR_TYPES.INSUFFICIENT_AUTHENTICATION:
            handleRedirect(redirect, REDIRECT_PATHS.LOGIN);
            break;
        case ERROR_TYPES.ACCESS_DENIED:
            handleRedirect(redirect, REDIRECT_PATHS.ERROR);
            break;
        case ERROR_TYPES.NEED_PROFILE_UPDATE:
            handleRedirect(redirect, REDIRECT_PATHS.MODIFY);
            break;
    }
};

const responseFail = (err) => {
    console.log(".....response fail error.....");

    if (err.response?.data) {
        handleErrorResponse(err.response.data);
    }
    return Promise.reject(err);
};

const refreshJWT = async (accessToken) => {
    const header = { headers: { "Authorization": `Bearer ${accessToken}` } };
    const res = await axiosInstance.get(`/member/refresh`, header);
    return res.data;
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;