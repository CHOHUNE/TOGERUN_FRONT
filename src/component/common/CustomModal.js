import React, { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CustomModal = ({ title, content, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all">
                {/* Modal content container */}
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent mb-6" />

                    {/* Content */}
                    <div className="mb-8">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {content}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700
                                     dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300
                                     font-medium transition-all duration-200
                                     hover:shadow-md active:scale-95"
                        >
                            취소
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white
                                     font-medium transition-all duration-200
                                     hover:shadow-md active:scale-95
                                     dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Animation styles */}
        <style jsx>{`
            .fixed {
                animation: fadeIn 0.3s ease-out;
            }
            
            .relative {
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: scale(0.95) translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `}</style>
    </div>
);

export default CustomModal;