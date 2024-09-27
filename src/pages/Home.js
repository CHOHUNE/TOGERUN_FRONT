import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import useCustomLogin from "../hooks/useCustomLogin";


// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import LoginComponent from "../component/member/LoginComponent";

// LoginModal component
const LoginModal = ({ isOpen, onClose }) => {
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
                <LoginComponent />
            </div>
        </div>
    );
};

function MainPage() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { loginState } = useCustomLogin();
    const navigate = useNavigate();

    const images = [
        'https://source.unsplash.com/1600x900/?fitness',
        'https://source.unsplash.com/1600x900/?running',
        'https://source.unsplash.com/1600x900/?yoga',
        'https://source.unsplash.com/1600x900/?gym'
    ];

    const handleFindMeeting = () => {
        if (loginState.email) {
            navigate('/post/list');
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center mb-8">같이달려요</h1>

                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mb-12"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-[400px] object-cover rounded-lg" />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-4">운동 파트너를 찾아보세요!</h2>
                    <p className="text-gray-600">함께 운동하면 더 즐겁고 효과적입니다. 지금 바로 시작해보세요.</p>
                </div>

                <div className="flex justify-center space-x-4">
                    <button onClick={handleFindMeeting} className="btn btn-primary">운동 모임 찾기</button>
                    <Link to="/about" className="btn btn-outline">서비스 소개</Link>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </div>
    );
}

export default MainPage;