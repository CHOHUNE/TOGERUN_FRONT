import React from 'react';
import {Outlet} from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";

const IndexPage = () => {

    return (
        <BasicLayout>
            <div className={"flex flex-wrap w-full"}>
                <Outlet/>
                {/*    라우터의 중첩을 정의 할때 OUTLET 사용 - 매치된 자식을 OutLet 에 렌더링 시킬 수 있다. */}
            </div>
        </BasicLayout>
    );
};

export default IndexPage;