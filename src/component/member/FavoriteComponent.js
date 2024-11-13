import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { getAllFavorites } from "../../api/memberAPI";
import { useNavigate } from 'react-router-dom';
import { favoriteToggle } from "../../api/postAPI";
import CustomModal from "../common/CustomModal";
import AnimatedRowComponent from "../common/AnimatedRowComponent";
import LoadingSpinner from "../common/LoadingSpinner";

const FavoriteComponent = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalConfig, setModalConfig] = useState({ show: false, title: '', content: '', onConfirm: null });
    const [selectedPostId, setSelectedPostId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await getAllFavorites();
                setFavorites(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleViewDetails = (postId) => {
        navigate(`/post/${postId}`);
    };

    const toggleDeleteModal = (postId) => {
        setSelectedPostId(postId);
        setModalConfig({
            show: true,
            title: '즐겨찾기 삭제',
            content: '즐겨찾기에서 삭제하시겠습니까?',
            onConfirm:  () => handleRemove(postId)
        });
    };

    const handleRemove = async (postId) => {
        try {
            await favoriteToggle(postId);
            setFavorites(favorites.filter(fav => fav.postId !== postId));
            setModalConfig({ show: false });
            setSelectedPostId(null);
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    };

    const closeModal = () => {
        setModalConfig({ show: false });
        setSelectedPostId(null);
    };

    const renderFavoriteCard = (favorite, index) => (
        <AnimatedRowComponent key={favorite.id} rowIndex={index}>
            <div className="w-full mb-4">
                <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="card-body p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="card-title text-sm sm:text-base">
                                {favorite.postTitle}
                            </h2>
                            <div className={`badge ${favorite.participateFlag ? 'badge-success' : 'badge-error'} badge-sm`}>
                                {favorite.participateFlag ? '참여가능' : '마감'}
                            </div>
                        </div>
                        <div className="badge badge-outline badge-sm mb-2">{favorite.activityType}</div>
                        <div className="text-xs sm:text-sm space-y-1">
                            <div className="flex items-center flex-wrap">
                                <div className="flex items-center mr-2">
                                    <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500" />
                                    <span>{format(parseISO(favorite.localDate), 'yy.MM.dd')}</span>
                                </div>
                                <div className="flex items-center">
                                    <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" />
                                    <span>{format(parseISO(favorite.meetingTime), 'HH:mm')}</span>
                                </div>
                            </div>
                            <div className="flex items-center flex-wrap">
                                <div className="flex items-center mr-2">
                                    <UserGroupIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-500" />
                                    <span>{favorite.capacity}명</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-500" />
                                    <span className="truncate">{favorite.placeName}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-indigo-500" />
                                <span className="truncate">{favorite.createdBy}</span>
                            </div>
                        </div>
                        <div className="card-actions justify-end mt-2">
                            <button
                                className="btn btn-primary btn-xs sm:btn-sm"
                                onClick={() => handleViewDetails(favorite.postId)}
                            >
                                상세
                            </button>
                            <button
                                className="btn btn-outline btn-error btn-xs sm:btn-sm"
                                onClick={() => toggleDeleteModal(favorite.postId)}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedRowComponent>
    );

    if (loading) return <LoadingSpinner fullScreen={true}/>
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="flex items-center mb-2 sm:mb-0">
                        <HeartIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white mr-2 sm:mr-4"/>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">My Favorites</h1>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 sm:px-4 sm:py-2">
                        <span className="text-white font-semibold text-sm sm:text-base">즐겨찾기 목록</span>
                    </div>
                </div>
                <p className="text-white mt-2 opacity-80 text-sm sm:text-base text-center sm:text-left">총 {favorites.length}개의 즐겨찾기</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((favorite, index) => renderFavoriteCard(favorite, index))}
            </div>

            {modalConfig.show && (
                <CustomModal
                    title={modalConfig.title}
                    content={modalConfig.content}
                    onClose={closeModal}
                    onConfirm={modalConfig.onConfirm}
                />
            )}
        </div>
    );
};

export default FavoriteComponent;