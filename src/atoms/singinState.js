import {atom} from "recoil";
import {getCookie} from "../util/cookieUtil";


export const initState = {
    email:'',
    nickname:'',
    accessToken:'',

}


const loadMemberCookie =() =>{

    const memberInfo = getCookie('member')

    if (memberInfo && memberInfo.nickname) {
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname)

    }

    return memberInfo

}

export const signInState = atom({
    key:'signInState',
    default:loadMemberCookie()||initState
})


