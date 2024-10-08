import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Navigation, Pagination} from 'swiper/modules';
import useCustomLogin from "../hooks/useCustomLogin";

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {ChatBubbleLeftRightIcon, HeartIcon, MapPinIcon, UserGroupIcon, UserPlusIcon} from "@heroicons/react/24/outline";
import BasicLayout from "../layouts/BasicLayout";
import {LoginModal} from "../component/member/LoginModal";

function MainPage() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { loginState } = useCustomLogin();
    const navigate = useNavigate();

    const images = [
        'https://study48678981512.s3.ap-northeast-2.amazonaws.com/chatApp/home/homepic1.jpg',
        'https://study48678981512.s3.ap-northeast-2.amazonaws.com/chatApp/home/homepic2.jpg',
        'https://study48678981512.s3.ap-northeast-2.amazonaws.com/chatApp/home/homepic3.jpg',
        'https://study48678981512.s3.ap-northeast-2.amazonaws.com/chatApp/home/homepic4.jpg'
    ];

    const handleFindMeeting = () => {
        if (loginState.email) {
            navigate('/post/list');
        } else {
            setIsLoginModalOpen(true);
        }
    };

    return (
        <BasicLayout>
        <div className="min-h-screen bg-gray-100">
            <div className="container max-w-full px-0 py-8">
                {/*<h1 className="text-4xl font-bold text-center mb-8">TOGERUN</h1>*/}

                <Swiper
                    spaceBetween={0}
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
                    className="w-full h-[650px] mb-12 relative z-0"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover"/>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold mb-4">운동 파트너를 찾아보세요!</h2>
                    <p className="text-gray-600">함께 운동하면 더 즐겁고 효과적입니다. 지금 바로 시작해보세요.</p>
                </div>

                <div className="flex justify-center space-x-4">
                    <button onClick={handleFindMeeting} className="btn btn-primary">
                        운동 모임 찾기
                        <UserPlusIcon className="w-5 h-5 ml-2"/>
                    </button>
                    {/*<Link to="/about" className="btn btn-outline">서비스 소개</Link>*/}
                </div>
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">TOGERUN - 운동 파트너 찾기</h1>

                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <h2 className="card-title">앱 소개</h2>
                        <p>
                            'TOGERUN'는 다양한 운동을 함께 즐길 수 있는 파트너를 찾는 실시간 채팅 기반 웹 애플리케이션입니다.
                            혼자 운동하기 심심하셨나요? 이제 'TOGERUN'와 함께 즐겁게 운동하세요!
                        </p>

                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-4">주요 기능</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            <ChatBubbleLeftRightIcon className="w-12 h-12 text-primary mb-2"/>
                            <h3 className="card-title">실시간 채팅</h3>
                            <p>운동 파트너와 실시간으로 대화하며 일정을 조율하세요.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            <UserGroupIcon className="w-12 h-12 text-secondary mb-2"/>
                            <h3 className="card-title">다양한 운동</h3>
                            <p>달리기, 등산, 자전거, 수영 등 다양한 운동을 선택할 수 있습니다.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            <MapPinIcon className="w-12 h-12 text-accent mb-2"/>
                            <h3 className="card-title">지역 기반 매칭</h3>
                            <p>가까운 지역의 운동 파트너를 쉽게 찾을 수 있습니다.</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <h2 className="card-title flex items-center">
                            <HeartIcon className="w-6 h-6 text-red-500 mr-2"/>
                            'TOGERUN'의 장점
                        </h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>운동 동기 부여 및 지속성 향상</li>
                            <li>새로운 사람들과의 만남을 통한 사회성 증진</li>
                            <li>다양한 운동 경험 공유</li>
                            <li>안전한 운동 환경 조성</li>
                            <li>건강한 라이프스타일 형성</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xl mb-4">지금 바로 'TOGERUN' 과 함께 건강하고 즐거운 운동을 시작하세요!</p>
                </div>
            </div>
        </div>
        </BasicLayout>
    );
}

export default MainPage;