import React from 'react';
import { SiKakaotalk, SiNaver } from "react-icons/si";
import { FaGoogle } from "react-icons/fa";


const LoginComponent = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">로그인</h2>

            <div className="space-y-4">
                <a
                    href="https://togerun.vercel.app/oauth2/authorization/kakao"
                    className="btn btn-block bg-[#FEE500] hover:bg-[#FDD900] text-black border-none font-medium py-3 rounded-md transition duration-300 ease-in-out flex items-center justify-center relative"
                >
                    <SiKakaotalk className="absolute left-4 text-2xl" />
                    카카오 로그인
                </a>

                <a
                    href="https://togerun.vercel.app/oauth2/authorization/naver"
                    className="btn btn-block bg-[#03C75A] hover:bg-[#02B64F] text-white border-none font-medium py-3 rounded-md transition duration-300 ease-in-out flex items-center justify-center relative"
                >
                    <SiNaver className="absolute left-4 text-2xl" />
                    네이버 로그인
                </a>

                <a
                    href="https://togerun.vercel.app/oauth2/authorization/google"
                    className="btn btn-block bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-3 rounded-md transition duration-300 ease-in-out flex items-center justify-center relative"
                >
                    <FaGoogle className="absolute left-4 text-2xl text-[#4285F4]" />
                    Google 로그인
                </a>
            </div>
        </div>
    );
};

export default LoginComponent;