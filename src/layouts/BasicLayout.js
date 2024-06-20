import React from "react";
import BasicMenu from "../menus/BasicMenu";
import Footer from "../component/common/Footer";


const BasicLayout = ({children}) => {
    return (
        <>

            <header className={"border-2"}>
                <BasicMenu/>
            </header>

            <div
                className="border-b-neutral-600 my-5 w-full flex flex-col space-y-1 md:flex-row md:space-x-1 md:space-y-0">

                <main
                    className=" w-full border-2 ">
                    {children}
                    {/*이 부분에 props가 들어감 -> MainPage*/}
                </main>
            </div>
            <Footer/>


        </>

    )
}
export default BasicLayout;