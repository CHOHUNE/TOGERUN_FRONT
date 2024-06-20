import React from 'react';
import BasicMenu from "../../menus/BasicMenu";
import LoginComponent from "../../component/post/LoginComponent";

const LoginPage = () => {
    return (
        <div className="fixed top-0 left-0 z-[1055] flex flex-col h-full w-full">
            <BasicMenu/>

            <div className="flex flex-wrap w-full h-full justify-center items-center border-2">
                <div className="text-2xl w-full max-w-lg">
                    <LoginComponent/>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
