

import React from "react";
import BasicMenu from "../menus/BasicMenu";
import Footer from "../component/common/Footer";

const BasicLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen w-full items-center">
            <header className="w-full bg-white border-b">
                <div className="w-[65%] mx-auto">
                    <BasicMenu/>
                </div>
            </header>

            <main className="w-[55%] flex-grow my-8">
                {children}
            </main>

            <Footer className="w-full mt-auto" />
        </div>
    )
}

export default BasicLayout;