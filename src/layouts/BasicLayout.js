import React from "react";
import BasicMenu from "../menus/BasicMenu";
import Footer from "../component/common/Footer";

const BasicLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen w-full items-center">
            <header className="w-full bg-white border-b">
                <div className="w-full px-4 sm:px-6 md:w-[90%] lg:w-[80%] xl:w-[65%] mx-auto">
                    <BasicMenu/>
                </div>
            </header>

            <main className="w-full px-4 sm:px-6 md:w-[90%] lg:w-[80%] xl:w-[55%] flex-grow my-4 sm:my-6 md:my-8">
                {children}
            </main>

            <Footer className="w-full mt-auto" />
        </div>
    )
}

export default BasicLayout;