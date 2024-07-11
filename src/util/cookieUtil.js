import {Cookies} from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name,value,days =1)=>{

    const expires = new Date()


    expires.setUTCDate(expires.getUTCDate()+days) // 일단 1일로 유지하고 나중에 시간으로 변경
    // UTC는 세계 협정시를 말한다.
    return cookies.set(name,value,{expires:expires,path:'/'})
}

export const getCookie =(name) =>{

    return cookies.get(name)

}

export const removeCookie = (name, path='/')=>{

    cookies.remove(name,{path:path})

}