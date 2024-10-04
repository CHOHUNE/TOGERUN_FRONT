import React from 'react';
import BasicLayout from "../../layouts/BasicLayout";
import FavoriteComponent from "../../component/member/FavoriteComponent";

function FavoritePage(props) {
    return (
        <BasicLayout>
            <FavoriteComponent/>
        </BasicLayout>

    );
}

export default FavoritePage;