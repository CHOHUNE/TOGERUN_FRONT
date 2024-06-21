
import React from 'react';

const rest_api_key = '995dc1e3b670dee696867930fef19998'
const redirect_uri = 'http://localhost:3000/member/kakao'
const auth_code_path = `http://kauth.kakao.com/oauth/authorize`


export const getKakaoLoginLink = () => {

    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`


    return kakaoURL;
};

