import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postInitState } from "../../atoms/postInitState";
import FetchingModal from "../common/FetchingModal";
import { HeartIcon, StarIcon, ChatBubbleLeftEllipsisIcon, PencilSquareIcon, ArrowUturnLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import KakaoMapComponent from "../kakaoMap/KakaoMapComponent";
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, EyeIcon } from "@heroicons/react/20/solid";
import { deleteOne, favoriteToggle, getOne } from "../../api/postAPI";
import { getChatRoomStatus } from "../../api/chatAPI";
import { likeToggle } from "../../api/api";
import CustomModal from "../common/CustomModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import LoadingSpinner from "../common/LoadingSpinner";

function ReadComponent({postId}) {
    const queryClient = useQueryClient();
    const [chatRoomStatus, setChatRoomStatus] = useState(null);
    const {moveToList, moveToModify} = useCustomMove();
    const {loginState} = useCustomLogin();
    const navigate = useNavigate();
    const [modalConfig, setModalConfig] = useState({ show: false, title: '', content: '', onConfirm: null });

    const {data, isFetching, refetch} = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getOne(postId),
        staleTime: 1000 * 60 * 30
    });

    useEffect(() => {
        const fetchChatRoomStatus = async () => {
            try {
                const status = await getChatRoomStatus(postId);
                setChatRoomStatus(status);
            } catch (error) {
                console.error("채팅방 상태 조회 중 오류 발생:", error);
            }
        }
        fetchChatRoomStatus();
    }, [postId]);

    const handleChatRoomEntry = () => {
        if (chatRoomStatus && chatRoomStatus.canJoin) {
            navigate(`/post/${postId}/chat`)
        } else {
            alert('현재 채팅방에 참여할 수 없습니다.')
        }
    }

    const processPostData = (postData) => {
        if (Array.isArray(postData) && postData.length === 2 && typeof postData[0] === 'string' && typeof postData[1] === 'object') {
            return postData[1];
        }
        return postData;
    };

    const post = processPostData(data) || postInitState;

    const delMutation = useMutation({
        mutationFn: (postId) => deleteOne(postId),
        onSuccess: () => {
            queryClient.invalidateQueries(['post/List']);
            setModalConfig({ show: false });
            moveToList();
        }
    });

    const likeMutation = useMutation({
        mutationFn: (postId) => likeToggle(postId),
        onSuccess: () => refetch(),
    });

    const favoriteMutation = useMutation({
        mutationFn: (postId) => favoriteToggle(postId),
        onSuccess: () => refetch(),
    });

    const closeModal = () => {
        setModalConfig({ show: false });
    }

    const handleClickDelete = () => {
        setModalConfig({
            show: true,
            title: '게시물 삭제',
            content: '게시물을 삭제하시겠습니까?',
            onConfirm: () => delMutation.mutate(postId)
        });
    }

    const handleLikeToggle = () => likeMutation.mutate(postId)
    const handleFavoriteToggle = () => favoriteMutation.mutate(postId)

    if (!post) return <LoadingSpinner fullScreen={true} />


    const canModifyOrDelete = () => {
        if (!loginState || !post) return false;

        const isAuthor = loginState.id === post.userId;
        const isAdmin = Array.isArray(loginState?.roleNames) && loginState.roleNames.includes('ROLE_ADMIN');

        return isAuthor || isAdmin;
    };


    console.log(loginState)

    return (
        <div className="min-h-screen py-8">
            {isFetching && <FetchingModal />}

            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-lg shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
                            <div className="flex items-center text-white text-sm">
                                <span className="mr-4">작성자: {post.nickname}</span>
                                <span>작성일: {new Date(post.localDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleLikeToggle}
                                className="flex items-center space-x-1 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-full py-2 px-4"
                            >
                                {post.like ? (
                                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                                ) : (
                                    <HeartIcon className="h-5 w-5 text-white" />
                                )}
                                <span className="text-white font-medium">{post.likeCount}</span>
                            </button>
                            <button
                                onClick={handleFavoriteToggle}
                                className="flex items-center space-x-1 bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 rounded-full py-2 px-4"
                            >
                                {post.favorite ? (
                                    <StarIconSolid className="h-5 w-5 text-yellow-500" />
                                ) : (
                                    <StarIcon className="h-5 w-5 text-white" />
                                )}
                                <span className="text-white font-medium">즐겨찾기</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                            <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500"/>
                            <span className="text-gray-700">모집 인원: {post.capacity}명</span>
                        </div>
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                            <CalendarIcon className="h-5 w-5 mr-2 text-green-500"/>
                            <span className="text-gray-700">날짜: {new Date(post.meetingTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                            <ClockIcon className="h-5 w-5 mr-2 text-purple-500"/>
                            <span className="text-gray-700">시간: {new Date(post.meetingTime).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                            <MapPinIcon className="h-5 w-5 mr-2 text-red-500"/>
                            <span className="text-gray-700">장소: {post.placeName}</span>
                        </div>
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                            <EyeIcon className="h-5 w-5 mr-2 text-indigo-500"/>
                            <span className="text-gray-700">조회수: {post.viewCount}</span>
                        </div>
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                            <MapPinIcon className="h-5 w-5 mr-2 text-orange-500"/>
                            <span className="text-gray-700">도로명 주소: {post.roadName}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">활동 유형</h3>
                        <div className="badge badge-lg badge-primary">{post.activityType}</div>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">참가 가능 여부</h3>
                        <div className={`badge badge-lg ${post.participateFlag ? 'badge-success' : 'badge-error'}`}>
                            {post.participateFlag ? '참여가능' : '마감'}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">상세 내용</h3>
                        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                    </div>

                    {post.imageList && post.imageList.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">이미지</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {post.imageList.map((image, index) => (
                                    <img key={index} src={image} alt={`Image ${index + 1}`} className="w-full h-48 object-cover rounded-lg shadow-md" />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">집결 장소</h3>
                        <div className="rounded-lg overflow-hidden shadow-md">
                            <KakaoMapComponent placeName={post.placeName} latitude={post.latitude} longitude={post.longitude} />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-end space-x-2 mt-6">
                        <button
                            className={`btn ${chatRoomStatus && chatRoomStatus.canJoin ? 'btn-primary' : 'btn-disabled'}`}
                            onClick={handleChatRoomEntry}
                            disabled={!chatRoomStatus || !chatRoomStatus.canJoin}
                        >
                            <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2"/>
                            {chatRoomStatus && chatRoomStatus.canJoin ? '채팅방 입장' : '입장 불가'}
                        </button>
                        {canModifyOrDelete() && (
                            <>
                                <button className="btn btn-outline btn-info" onClick={() => moveToModify(postId)}>
                                    <PencilSquareIcon className="h-5 w-5 mr-2"/>
                                    수정
                                </button>
                                <button className="btn btn-outline btn-error" onClick={handleClickDelete}>
                                    <TrashIcon className="h-5 w-5 mr-2"/>
                                    삭제
                                </button>
                            </>
                        )}
                        <button className="btn btn-outline btn-warning" onClick={moveToList}>
                            <ArrowUturnLeftIcon className="h-5 w-5 mr-2"/>
                            목록
                        </button>

                </div>
                </div>
            </div>

            {modalConfig.show && (
                <CustomModal
                    title={modalConfig.title}
                    content={modalConfig.content}
                    onClose={closeModal}
                    onConfirm={modalConfig.onConfirm}
                />
            )}

            {delMutation.isSuccess && (
                <ResultModal title={'게시글 삭제'} content={`게시물 삭제가 완료되었습니다.`} callbackFn={closeModal} />
            )}
        </div>
    );
}

export default ReadComponent;