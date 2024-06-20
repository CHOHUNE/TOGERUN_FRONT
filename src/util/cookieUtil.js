import{Cookies} from "react-cookie";


const cookies = new Cookies();

export const setCookie =(name,value,days=1)=> {

    const expires = new Date();

    expires.setUTCDate(expires.getUTCDate() + days); // UTDDate 는 세계 협정시를 말한다.
    return cookies.set(name, value, {expires: expires, path: '/'})

    //세번째 파라메터를 보면 중괄호로 키밸류 쌍이 전달 되는데
    // 여기서 name 을 키로  value 를 밸류로 설정하겠다는 내용이 1,2 번째 파라메터에 설정한다.
    // path :'/' 는 쿠키를 전체적으로 사용하겠다는 의미이다.

}
    export const getCookie =(name)=>{
        return cookies.get(name)
    }


export const removeCookie = (name,path="/")=>{
    cookies.remove(name,{path:path})
}

