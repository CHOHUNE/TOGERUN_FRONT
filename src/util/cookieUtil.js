import {Cookies} from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, hours = 12) => {

    const expires = new Date()


    expires.setUTCDate(expires.getUTCDate() + (hours * 60 * 60 * 1000))
    // UTC는 세계 협정시를 말한다.
    return cookies.set(name, value, {expires: expires, path: '/'})
}

export const getCookie = (name) => {

    return cookies.get(name)

}

export const removeCookie = (name) => {
    // 도메인별로 쿠키 제거
    const domains = ['.togerun.shop', 'www.togerun.shop'];

    domains.forEach(domain => {
        cookies.remove(name, {
            path: '/',
            domain: domain,
            secure: true
        });
    });

}