import React, {useEffect} from 'react';
import {useSearchParams} from "react-router-dom";
import {getAccessToken, getMemberAccessToken} from "../../api/kakaoApi";
import {useDispatch} from "react-redux";
import useCustomLogin from "../../hooks/useCustomLogin";
import {login} from "../../slice/loginSlice";

function KakaoRedirectPage(props) {

    const [searchParams] = useSearchParams();

    const dispatch = useDispatch();

    const {moveToPath} = useCustomLogin();

    const authCode = searchParams.get('code');

    useEffect(() => {
        getAccessToken(authCode).then(accessToken=>{
            getMemberAccessToken(accessToken).then(memberInfo=>{
                console.log("...........")
                console.log(memberInfo)
                dispatch(login(memberInfo))
                console.log("...........")

                if (memberInfo && memberInfo.social) {
                    moveToPath('/member/modify')
                }else{
                    moveToPath("/")
                }
            })
        })
    }, [authCode]);
    return (
        <div>
            <div>KaKao Login Redirect</div>
            <div>authCode: {authCode}</div>

        </div>
    );
}

export default KakaoRedirectPage;