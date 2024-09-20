import React from "react";
import BasicMenu from "../menus/BasicMenu";
import Footer from "../component/common/Footer";

const BasicLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
                    <BasicMenu/>
                </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 my-8">
                {children}
            </main>

            <Footer className="mt-auto" />
        </div>
    )
}

export default BasicLayout;