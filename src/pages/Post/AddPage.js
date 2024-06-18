import React, {useState} from 'react';
import {postAdd} from "../../api/api";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../../component/common/ResultModal";
import AddComponent from "../../component/post/AddComponent";

const AddPage = () => {


    return (
        <div className="container mx-auto p-4">
            <AddComponent/>
        </div>
                );
            };

export default AddPage;
