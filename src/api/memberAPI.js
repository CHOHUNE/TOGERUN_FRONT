import {axiosInstance} from "./api";
import jwtAxios from "../util/JwtUtil";

const host = "/member"

export const loginPost = async (loginParam) => {
    const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}
    // urlencoded : key=value&key=value&key=value 형태로 전송
    const form = new FormData()

    form.append('username', loginParam.email)
    form.append('password', loginParam.pw)

    const res = await axiosInstance.post(`${host}/login`, form, header)
    return res.data
}

export const modifyMember = async (member) => {
    const res = await jwtAxios.put(`${host}/modify`, member)
    return res.data
}

export const fetchMessages = async (postId) => {
    const res = await jwtAxios.get(`/post/${postId}/chat`)
    return res.data
}

