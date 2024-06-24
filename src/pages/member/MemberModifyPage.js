import React from 'react';
import MemberModifyComponent from "../../component/member/MemberModifyComponent";
import BasicLayout from "../../layouts/BasicLayout";

function ModifyPage(props) {

    return (
        <BasicLayout>
        <div className="container mx-auto p-4">
            <MemberModifyComponent />
        </div>
        </BasicLayout>
    );
}

export default ModifyPage;