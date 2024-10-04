import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { getAllFavorites } from "../../api/memberAPI";
import { useNavigate } from 'react-router-dom';
import { favoriteToggle } from "../../api/postAPI";

const FavoriteComponent = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        setShowDeleteModal(!showDeleteModal);
    };

    const handleRemove = async () => {
        try {
            await favoriteToggle(selectedPostId);
            setFavorites(favorites.filter(fav => fav.postId !== selectedPostId));
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Error removing favorite:", err);
        }
    };

    if (loading) return <div className="loading loading-lg"></div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((favorite) => (
                    <div key={favorite.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-300">
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
                ))}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="font-bold text-lg mb-4">즐겨찾기에서 삭제하시겠습니까?</h3>
                        <div className="flex justify-end space-x-2">
                            <button className="btn btn-error btn-sm" onClick={handleRemove}>삭제</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoriteComponent;