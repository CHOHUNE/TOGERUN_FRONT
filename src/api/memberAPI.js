import {axiosInstance} from "./api";
import jwtAxios from "../util/JwtUtil";

export const loginPost = async (loginParam) => {
    const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}
    // urlencoded : key=value&key=value&key=value 형태로 전송
    const form = new FormData()

    form.append('username', loginParam.email)
    form.append('password', loginParam.pw)

    const res = await axiosInstance.post(`/member/login`, form, header)
    return res.data
}

export const getMember = async () => {
    const res = await jwtAxios.get('/user/info')
    return res.data
}

export const modifyMember = async (member) => {
    const res = await jwtAxios.put('/user/modify', member)
    return res.data
}

export const getJoinedChatRoom = async () => {
    const response = await jwtAxios.get('/user/joined');
    return response.data;
}