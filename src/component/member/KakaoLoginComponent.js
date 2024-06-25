import React from 'react';
import {getKakaoLoginLink} from "../../api/kakaoApi";
import {Link} from "react-router-dom";

const link = getKakaoLoginLink()

function KakaoLoginComponent(props) {
    return (
                <div
                    className={"form-control mt-3"}>
                    <Link to={link} className="bg-yellow-400 text-black font-bold py-2 px-4 rounded text-center text-sm">
                        KAKAO LOGIN
                    </Link>
                </div>

    );
}

export default KakaoLoginComponent;