import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { getAllFavorites } from "../../api/memberAPI";
import { useNavigate } from 'react-router-dom';
import { favoriteToggle } from "../../api/postAPI";
import AnimatedRowComponent from "../common/AnimatedRowComponent";
import CustomModal from "../common/CustomModal";


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
            onConfirm: handleRemove
        });
    };

    const handleRemove = async () => {
        try {
            await favoriteToggle(selectedPostId);
            setFavorites(favorites.filter(fav => fav.postId !== selectedPostId));
            setModalConfig({ show: false });
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    };

    const closeModal = () => {
        setModalConfig({ show: false });
    };

    const groupFavorites = (favorites, size) => {
        return favorites.reduce((acc, _, index) => {
            if (index % size === 0) {
                acc.push(favorites.slice(index, index + size));
            }
            return acc;
        }, []);
    };

    const groupedFavorites = groupFavorites(favorites, 3);

    const renderFavoriteCard = (favorite) => (
        <div key={favorite.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="card-body p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="card-title text-base">
                            {favorite.postTitle}
                        </h2>
                        <div className={`badge ${favorite.participateFlag ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {favorite.participateFlag ? '참여가능' : '마감'}
                        </div>
                    </div>
                    <div className="badge badge-outline badge-sm mb-2">{favorite.activityType}</div>
                    <div className="text-sm space-y-1">
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1 text-blue-500" />
                            <span>{format(parseISO(favorite.localDate), 'yy.MM.dd')}</span>
                            <ClockIcon className="w-4 h-4 ml-2 mr-1 text-green-500" />
                            <span>{format(parseISO(favorite.meetingTime), 'HH:mm')}</span>
                        </div>
                        <div className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1 text-purple-500" />
                            <span>{favorite.capacity}명</span>
                            <MapPinIcon className="w-4 h-4 ml-2 mr-1 text-red-500" />
                            <span className="truncate">{favorite.placeName}</span>
                        </div>
                        <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1 text-indigo-500" />
                            <span className="truncate">{favorite.createdBy}</span>
                        </div>
                    </div>
                    <div className="card-actions justify-end mt-2">
                        <button
                            className="btn btn-primary btn-xs"
                            onClick={() => handleViewDetails(favorite.postId)}
                        >
                            상세
                        </button>
                        <button
                            className="btn btn-outline btn-error btn-xs"
                            onClick={() => toggleDeleteModal(favorite.postId)}
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="loading loading-lg"></div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <HeartIcon className="h-10 w-10 text-white mr-4"/>
                        <h1 className="text-3xl font-bold text-white">My Favorites</h1>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-full px-4 py-2">
                        <span className="text-white font-semibold">즐겨찾기 목록</span>
                    </div>
                </div>
                <p className="text-white mt-2 opacity-80">총 {favorites.length}개의 즐겨찾기</p>
            </div>
            <div>
                {groupedFavorites.map((row, index) => (
                    <AnimatedRowComponent key={index} rowIndex={index}>
                        {row.map(renderFavoriteCard)}
                    </AnimatedRowComponent>
                ))}
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