import React from 'react';
import AdminComponent from "../../component/common/AdminComponent";
import BasicLayout from "../../layouts/BasicLayout";

function AdminPage(props) {
    return (
        <div className="container mx-auto p-4">
            <BasicLayout>
                <AdminComponent/>
            </BasicLayout>
        </div>
    );
}

export default AdminPage;