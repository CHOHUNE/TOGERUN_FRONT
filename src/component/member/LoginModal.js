// LoginModal component
import LoginComponent from "./LoginComponent";
import React from "react";

export const LoginModal = ({isOpen, onClose}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <button
                    className="absolute right-2 top-2 btn btn-sm btn-circle btn-ghost"
                    onClick={onClose}
                >
                    ✕
                </button>
                <LoginComponent/>
            </div>
        </div>
    );
};