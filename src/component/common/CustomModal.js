import React from 'react';
import { X } from 'lucide-react';

const CustomModal = ({ title, content, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors group"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                </button>
            </div>
            <div className="mb-6 text-gray-600 leading-relaxed">{content}</div>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 font-medium text-sm"
                >
                    취소
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors duration-150 font-medium text-sm shadow-sm hover:shadow"
                >
                    확인
                </button>
            </div>
        </div>
    </div>
);

export default CustomModal;