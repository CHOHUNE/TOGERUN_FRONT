import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CustomModal = ({ title, content, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4 animate-scaleIn">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <p className="mb-6 text-gray-600">{content}</p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                    취소
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                    확인
                </button>
            </div>
        </div>
    </div>
);

export default CustomModal;