import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import { EyeIcon, MapPinIcon, HeartIcon, UserIcon, CalendarIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getList } from "../../api/postAPI";
import { Navigation } from "swiper/modules";
import AnimatedRowComponent from "../common/AnimatedRowComponent";
import { ClipboardIcon } from "@heroicons/react/16/solid";
import LoadingSpinner from "../common/LoadingSpinner";

const initState = {
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: [],
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0,
};

const REGIONS = ['서울', '경기', '강원', '충청', '경상', '부산', '전라', '제주'];
const ACTIVITIES = [
    { name: '등산', value: 'CLIMBING' },
    { name: '달리기', value: 'RUNNING' },
    { name: '하이킹', value: 'HIKING' },
    { name: '자전거', value: 'CYCLING' },
    { name: '서핑', value: 'SURFING' }
];

function ListComponent() {
    const { page, refresh, size, moveToList, keyword } = useCustomMove();
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    const [activeTab, setActiveTab] = useState('region');
    const navigate = useNavigate();

    const { data, isFetching } = useQuery({
        queryKey: ['post/List', { page, size, refresh, keyword, selectedRegion, selectedActivity }],
        queryFn: () => getList({
            page,
            size,
            keyword: keyword || undefined,
            region: selectedRegion || undefined,
            activityType: selectedActivity || undefined
        }),
        staleTime: 1000 * 60 * 5
    });

    const serverData = data || initState;

    const handleClickPage = (pageParam) => {
        moveToList(pageParam)
    }

    const formatRoadName = (roadName) => {
        const parts = roadName?.split(' ') || [];
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1]}`;
        }
        return roadName || '주소 없음';
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(prev => prev === region ? '' : region);
    }

    const handleActivitySelect = (activity) => {
        setSelectedActivity(prev => prev === activity.value ? '' : activity.value);
    }

    const getActivityName = (value) => {
        const activity = ACTIVITIES.find(a => a.value === value);
        return activity ? activity.name : value;
    }

// renderPostCard 함수 부분만 수정된 버전입니다
    const renderPostCard = (post) => (
        <AnimatedRowComponent key={post.id} rowIndex={serverData.dtoList.indexOf(post)}>
            <div className="w-full h-full px-2">
                <div className="card bg-base-100 shadow-xl h-full hover:shadow-2xl transition-shadow duration-200">
                    <div className="card-body p-4">
                        <Link
                            to={`/post/${post.id}`}
                            className="group transition-all duration-200"
                        >
                            <h2 className="text-base sm:text-lg font-semibold mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors duration-200">
                                {post.title}
                            </h2>
                        </Link>
                        <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mb-2">
                            <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/>
                            <span className="mr-2">{post.nickname}</span>
                            <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/>
                            <span>{post.localDate}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                        <span className={`badge badge-sm ${post.participateFlag ? 'badge-success' : 'badge-error'}`}>
                            {post.participateFlag ? '참여가능' : '마감'}
                        </span>
                            <span className="badge badge-sm badge-info">
                            <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/>
                                {post.viewCount}
                        </span>
                            <span className="badge badge-sm badge-warning">
                            <HeartIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/>
                                {post.likeCount}
                        </span>
                            <span className="badge badge-sm badge-accent">
                            {getActivityName(post.activityType)}
                        </span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                            <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1"/>
                            <span>{formatRoadName(post.roadName)}</span>
                        </div>
                        <div className="card-actions justify-end mt-auto">
                            <Link to={`/post/${post.id}`}
                                  className="btn btn-primary btn-xs sm:btn-sm">
                                자세히 보기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedRowComponent>
    );

    return (
        <div className="container mx-auto px-4 py-6">
            {isFetching && <LoadingSpinner fullScreen={true}/>}

            <div className="bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center mb-2 sm:mb-0">
                        <ClipboardIcon className="h-6 w-6 sm:h-10 sm:w-10 text-white mr-2 sm:mr-4"/>
                        <h1 className="text-xl sm:text-3xl font-bold text-white">게시글 목록</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <span className="text-white text-sm sm:text-base mb-2 sm:mb-0 sm:mr-4">
                            총 {serverData.totalCount}개의 게시글
                        </span>
                        <button onClick={() => navigate("/post/write")} className="btn btn-primary btn-sm sm:btn-md">
                            <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"/>
                            글 작성
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="tabs tabs-boxed mb-2">
                    <a
                        className={`tab tab-sm sm:tab-md ${activeTab === 'region' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('region')}
                    >
                        지역 선택
                    </a>
                    <a
                        className={`tab tab-sm sm:tab-md ${activeTab === 'activity' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        종목 선택
                    </a>
                </div>
                <div className="mt-2 relative">
                    <style jsx>{`
                        .swiper-button-next,
                        .swiper-button-prev {
                            top: 60% !important;
                            width: 30px !important;
                            height: 30px !important;
                            background-color: rgba(255, 255, 255, 0.8);
                            border-radius: 50%;
                            color: #000 !important;
                        }

                        .swiper-button-next:after,
                        .swiper-button-prev:after {
                            font-size: 15px !important;
                        }

                        .swiper-button-prev {
                            left: 0px !important;
                        }

                        .swiper-button-next {
                            right: 0px !important;
                        }
                    `}</style>
                    {activeTab === 'region' && (
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={5}
                            slidesPerView={3}
                            breakpoints={{
                                640: {slidesPerView: 4, spaceBetween: 10},
                                768: {slidesPerView: 5},
                                1024: {slidesPerView: 8},
                            }}
                            className="mySwiper px-8"
                        >
                            {REGIONS.map(region => (
                                <SwiperSlide key={region}>
                                    <button
                                        onClick={() => handleRegionSelect(region)}
                                        className={`btn btn-xs sm:btn-sm w-full ${selectedRegion === region ? 'btn-primary' : 'btn-outline'}`}
                                    >
                                        {region}
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                    {activeTab === 'activity' && (
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={5}
                            slidesPerView={3}
                            breakpoints={{
                                640: {slidesPerView: 4, spaceBetween: 10},
                                768: {slidesPerView: 5},
                                1024: {slidesPerView: 6},
                            }}
                            className="mySwiper px-8"
                        >
                            {ACTIVITIES.map(activity => (
                                <SwiperSlide key={activity.value}>
                                    <button
                                        onClick={() => handleActivitySelect(activity)}
                                        className={`btn btn-xs sm:btn-sm w-full ${selectedActivity === activity.value ? 'btn-secondary' : 'btn-outline'}`}
                                    >
                                        {activity.name}
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>

            {(keyword || selectedRegion || selectedActivity) && (
                <p className="text-sm sm:text-lg font-semibold mb-4">
                    검색 조건: {[
                    keyword,
                    selectedRegion,
                    selectedActivity ? getActivityName(selectedActivity) : ''
                ].filter(Boolean).join(', ')}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {serverData.dtoList.map(renderPostCard)}
            </div>

            <div className="mt-8">
                <PageComponent serverData={serverData} movePage={handleClickPage}/>
            </div>
        </div>
    );
}

export default ListComponent;