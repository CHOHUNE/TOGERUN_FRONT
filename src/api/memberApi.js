import {axiosInstance} from "./api";

const host = "/member"

export const loginPost = async(loginParam)=>{

    const header = {headers :{"Content-Type":"x-www-form-urlencoded"}}
    // urlencoded : key=value&key=value&key=value 형태로 전송

    const form = new FormData()

    form.append('username',loginParam.email)
    form.append('password',loginParam.pw)

    const res = await axiosInstance.post(`${host}/login`,form,header)

    return res.data

}