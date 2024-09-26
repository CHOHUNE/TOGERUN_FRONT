import React from 'react';
import LoginComponent from "../../component/member/LoginComponent";
import BasicLayout from "../../layouts/BasicLayout";

const LoginPage = () => {
    return (
        <BasicLayout>

            <div className="flex flex-wrap w-full h-full justify-center items-center border-2">
                <div className="text-2xl w-full max-w-lg">
                    <LoginComponent/>
                </div>
            </div>
        </BasicLayout>
    );
};

export default LoginPage;
