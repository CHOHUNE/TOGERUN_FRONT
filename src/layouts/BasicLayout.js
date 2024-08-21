import React from "react";
import BasicMenu from "../menus/BasicMenu";
import Footer from "../component/common/Footer";

const BasicLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <BasicMenu/>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 my-8">
                {children}
            </main>

            <Footer className="mt-auto" />
        </div>
    )
}

export default BasicLayout;