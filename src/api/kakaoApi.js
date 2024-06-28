//
// import axios from "axios";
// import {axiosInstance} from "./api";
//
// const rest_api_key = '995dc1e3b670dee696867930fef19998'
// const redirect_uri = 'http://localhost:3000/member/kakao'
// const auth_code_path = `http://kauth.kakao.com/oauth/authorize`
// const access_token_url= `https://kauth.kakao.com/oauth/token`
//
//
//
// export const getKakaoLoginLink = () => {
//
//     const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
//
//     return kakaoURL;
// };
//
// export const getAccessToken = async(authCode)=>{
//     const header ={
//         headers:{
//             "Content-Type":"application/x-www-form-urlencoded"
//         }
//     }
//
//     const params ={
//         grant_type:"authorization_code",
//         client_id:rest_api_key,
//         redirect_uri:redirect_uri,
//         code:authCode
//     }
//
//     const res = await axios.post(access_token_url,params,header)
//
//     const accessToken= res.data.access_token
//
//     return accessToken
// }
//
// export const getMemberAccessToken = async(accessToken)=>{
//
//     const res = await axiosInstance.get(`/member/kakao?accessToken=${accessToken}`)
//
//     return res.data
// }
//
//
//
// // 1. 버튼 클릭시 카카오 링크 생성 : getKakaoLoginLink 함수가 호출되어 카카오 인증 URL을 생성한다
// // 해당 LoginLink 에는 api key, redirect uri, response type 등이 포함되어 있다.
//
// // 2. redirect uri 로 이동하면 useEffect 함수에 의해 getAccessToken 이 실행되고  - 토큰 url 과 파람 헤더를 바탕으로 accToken 을 얻는다
// // > getMemberAccessToken