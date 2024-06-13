import React, {useCallback} from 'react';
import {Outlet, useNavigate} from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";

const IndexPage = () => {

    const navigate = useNavigate();
    const handleClickList = useCallback(()=>{
        navigate({pathname:'list'},[])
    })

    const handleClickAdd = useCallback( ()=>{
        navigate({pathname:'write'},[])
    })

    return (
        <BasicLayout>
            <div className={"w-full flex m-2 p-2"}>
                <div className={"text-xl m-1 p-2 w-20 font-extrabold text-center underline"} onClick={handleClickList}>
                    LIST
                </div>
                <div className={"text-xl m-1 p-2 w20 font-extrabold text-center underline"} onClick={handleClickAdd}>ADD</div>
            </div>
            <div className={"flex flex-wrap w-full"}>
                <Outlet/>
                {/*    라우터의 중첩을 정의 할때 OUTLET 사용 - 매치된 자식을 OutLet 에 렌더링 시킬 수 있다. */}
            </div>
        </BasicLayout>




    );
};

export default IndexPage;