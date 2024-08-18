import React from 'react';
import AddComponent from "../../component/post/AddComponent";
import KakaoMapSearchComponent from "../../component/kakaoMap/KakaoMapSearchComponent";

const AddPage = () => {


    return (
        <div className="container mx-auto p-4">
            <AddComponent/>
            <KakaoMapSearchComponent/>
        </div>
    );
};

export default AddPage;
