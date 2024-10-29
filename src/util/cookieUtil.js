import {Cookies} from "react-cookie";

const cookies = new Cookies();

const COOKIE_CONFIG={
    domain:`.togerun.shop`,
    path:'/',
    secure:true
}

const hoursToMilliseconds =(hours)=> hours * 60 * 60 * 1000


export const setCookie = (name, value, hours = 12) => {

    const expires = new Date()
    expires.setTime(expires.getTime() + hoursToMilliseconds(1))

    return cookies.set(name, value, {...COOKIE_CONFIG,expires})
}

export const getCookie = (name) => {
    return cookies.get(name)
}

export const removeCookie = (name) => {
    // 도메인별로 쿠키 제거

        cookies.remove(name, COOKIE_CONFIG);
    }

