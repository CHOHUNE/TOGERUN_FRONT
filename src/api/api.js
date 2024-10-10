import axios from "axios";
import jwtAxios from "../util/JwtUtil";

export const basicURL = 'http://localhost:8080/api'

export const axiosInstance = axios.create({
    baseURL: basicURL,
    withCredentials: true
    //추후 배포시 baseURL 만 변경 해준다
})


export const likeToggle =async (postId)=>{
    const response = await jwtAxios.post(`/post/${postId}/like`);
    return response.data
}

export const fetchNotifications = async ( page=0, size=5)=>{
    const response = await jwtAxios.get(`/notifications/all?page=${page}&size=${size}`)
    return response.data
}

export const markNotificationAsRead = async(notificationId)=>{
    const response = await jwtAxios.post(`/notifications/${notificationId}/read`);
    return response.data
}

export const fetchUnreadCount=async ()=>{
    const response = await jwtAxios.get(`/notifications/unread/count`);
    return response.data

}

export const clearNotification = async()=>{
    const response = await jwtAxios.post(`/notifications/clear`)
    return response.data
}


