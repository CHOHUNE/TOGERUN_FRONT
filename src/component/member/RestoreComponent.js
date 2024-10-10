import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import CustomModal from "../common/CustomModal";


function RestoreComponent({ userId }) {
    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();
    const { moveToList } = useCustomMove();

    const handleConfirm = () => {
        // 계정 복구 대신 member modify 페이지로 리다이렉트
        navigate(`/member/modify/`);
    };

    const handleClose = () => {
        setShowModal(false);
        moveToList();
    };

    return (
        <div className="container mx-auto p-4">
            {showModal && (
                <CustomModal
                    title="계정 복구"
                    content="삭제된 계정입니다. 복구 하시겠습니까?"
                    onClose={handleClose}
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
}

export default RestoreComponent;