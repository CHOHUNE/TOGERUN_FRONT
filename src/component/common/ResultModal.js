import React, { useEffect } from 'react';
import { IoClose } from "react-icons/io5";

const ResultModal = ({ title, content, callbackFn }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        if (callbackFn) {
            callbackFn();
        }
    };

    return (
        <div className="fixed inset-0 z-50" onClick={handleClose}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-xl shadow-lg max-w-md w-full animate-in zoom-in-95 duration-200"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="relative p-6">
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                            aria-label="Close modal"
                        >
                            <IoClose className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                        </button>

                        <h3 className="text-lg font-semibold text-gray-900 pr-8">{title}</h3>
                        <div className="mt-4 text-gray-600 leading-relaxed">{content}</div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleClose}
                                className="min-w-24 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors duration-150 font-medium text-sm shadow-sm hover:shadow"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;