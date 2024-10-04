import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PageComponent from "../common/PageComponent";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import { EyeIcon, MapPinIcon, HeartIcon, UserIcon, CalendarIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getList } from "../../api/postAPI";
import { Navigation, Pagination } from "swiper/modules";

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

const REGIONS = ['서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종', '경북', '경남', '대구', '울산', '부산', '전북', '전남', '광주', '제주'];
const ACTIVITIES = [
    { name: '등산', value: 'CLIMBING' },
    { name: '달리기', value: 'RUNNING' },
    { name: '하이킹', value: 'HIKING' },
    { name: '자전거', value: 'CYCLING' },
    { name: '요가', value: 'YOGA' },
    { name: '필라테스', value: 'PILATES' },
    { name: '웨이트 트레이닝', value: 'WEIGHT_TRAINING' },
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

    const handleClickPage = (pageParam) => {
        moveToList(pageParam)
    }

    const formatRoadName = (roadName) => {
        const parts = roadName.split(' ');
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1]}`;
        }
        return roadName;
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

    const serverData = data || initState;

    return (
        <div className="container mx-auto px-4 py-8">
            {isFetching && <FetchingModal/>}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">게시글 목록</h1>
                <button onClick={() => navigate("/post/write")} className="btn btn-primary">
                    <PencilIcon className="h-5 w-5 mr-2"/>
                    글 작성
                </button>
            </div>

            <div className="mb-6">
                <div className="tabs tabs-boxed">
                    <a
                        className={`tab ${activeTab === 'region' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('region')}
                    >
                        지역 선택
                    </a>
                    <a
                        className={`tab ${activeTab === 'activity' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('activity')}
                    >
                        종목 선택
                    </a>
                </div>
                <div className="mt-4">
                    {activeTab === 'region' && (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{
                                clickable: true,
                                el: ".swiper-pagination", // Assign a custom class for pagination
                            }}
                            spaceBetween={10}
                            slidesPerView={2}
                            breakpoints={{
                                640: {
                                    slidesPerView: 3,
                                },
                                768: {
                                    slidesPerView: 4,
                                },
                                1024: {
                                    slidesPerView: 5,
                                },
                            }}
                            className="mySwiper"
                            style={{
                                padding: '20px 40px', // Add padding to ensure arrows don’t overlap the content
                            }}
                        >
                            {REGIONS.map(region => (
                                <SwiperSlide key={region}>
                                    <button
                                        onClick={() => handleRegionSelect(region)}
                                        className={`btn btn-sm w-full ${selectedRegion === region ? 'btn-primary' : 'btn-outline'}`}
                                    >
                                        {region}
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    )}
                    {activeTab === 'activity' && (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{
                                clickable: true,
                                el: ".swiper-pagination", // Assign a custom class for pagination
                            }}
                            spaceBetween={10}
                            slidesPerView={2}
                            breakpoints={{
                                640: {
                                    slidesPerView: 3,
                                },
                                768: {
                                    slidesPerView: 4,
                                },
                                1024: {
                                    slidesPerView: 5,
                                },
                            }}
                            className="mySwiper"
                            style={{
                                padding: '20px 40px', // Add padding to ensure arrows don’t overlap the content
                            }}
                        >
                            {ACTIVITIES.map(activity => (
                                <SwiperSlide key={activity.value}>
                                    <button
                                        onClick={() => handleActivitySelect(activity)}
                                        className={`btn btn-sm w-full ${selectedActivity === activity.value ? 'btn-secondary' : 'btn-outline'}`}
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
                <p className="text-lg font-semibold mb-4">
                    검색 조건: {[
                    keyword,
                    selectedRegion,
                    selectedActivity ? getActivityName(selectedActivity) : ''
                ].filter(Boolean).join(', ')}
                </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serverData.dtoList.map((post) => (
                    <div key={post.id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">
                                <Link to={`/post/${post.id}`} className="link link-primary">
                                    {post.title}
                                </Link>
                            </h2>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                <UserIcon className="h-4 w-4 mr-1"/>
                                <span>{post.nickname}</span>
                                <CalendarIcon className="h-4 w-4 ml-4 mr-1"/>
                                <span>{post.localDate}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`badge ${post.participateFlag ? 'badge-success' : 'badge-error'}`}>
                                    {post.participateFlag ? '참여가능' : '마감'}
                                </span>
                                <span className="badge badge-info">
                                    <EyeIcon className="h-4 w-4 mr-1"/>
                                    {post.viewCount}
                                </span>
                                <span className="badge badge-warning">
                                    <HeartIcon className="h-4 w-4 mr-1"/>
                                    {post.likeCount}
                                </span>
                                <span className="badge badge-accent">
                                    {getActivityName(post.activityType)}
                                </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <MapPinIcon className="h-4 w-4 mr-1"/>
                                <span>{formatRoadName(post.roadName)}</span>
                            </div>
                            <div className="card-actions justify-end">
                                <Link to={`/post/${post.id}`} className="btn btn-primary btn-sm">
                                    자세히 보기
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <PageComponent serverData={serverData} movePage={handleClickPage}/>
            </div>
        </div>
    );
}

export default ListComponent;
