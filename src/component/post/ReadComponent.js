import React, {useState} from 'react';
import {deleteOne, favoriteToggle, getOne, likeToggle,} from "../../api/api";
import {useNavigate} from "react-router-dom";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {postInitState} from "../../atoms/postInitState";
import FetchingModal from "../common/FetchingModal";
import { HeartIcon, StarIcon, ChatBubbleLeftEllipsisIcon, PencilSquareIcon, ArrowUturnLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import KakaoMapComponent from "../kakaoMap/KakaoMapComponent";
import {CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon} from "@heroicons/react/20/solid";

function ReadComponent({postId}) {

    const {data, isFetching} = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getOne(postId),
        staleTime: 1000 * 60 * 30
    });

    const queryClient = useQueryClient();

    const processPostData = (postData) => {
        if (Array.isArray(postData) && postData.length === 2 && typeof postData[0] === 'string' && typeof postData[1] === 'object') {
            return postData[1];  // 실제 PostDTO 데이터는 두 번째 요소
        }
        return postData;  // 이미 처리된 데이터인 경우 그대로 반환
    };

    const post = processPostData(data) || postInitState;

    const {moveToList, moveToModify} = useCustomMove();

    const navigate = useNavigate();

    const delMutation = useMutation({
        mutationFn: (postId) => deleteOne(postId),
        onSuccess: () => {
            queryClient.invalidateQueries(['post/List']);
            setShowDeleteModal(false);
            moveToList();
        }
    });
    const likeMutation = useMutation({
        mutationFn: (postId) => likeToggle(postId),
        onMutate: async () => {
            await queryClient.cancelQueries(['post', postId]);
            const previousPost = queryClient.getQueryData(['post', postId]);

            queryClient.setQueryData(['post', postId], old => ({
                ...old,
                like: !old.like,
                likeCount: old.like ? old.likeCount - 1 : old.likeCount + 1
            }));

            return { previousPost };
        },
        onError: (err, postId, context) => {
            queryClient.setQueryData(['post', postId], context.previousPost);
        },
        // onSettled: () => {
        //     queryClient.invalidateQueries(['post', postId]);
        // }
    });

    const favoriteMutation = useMutation({
        mutationFn: (postId) => favoriteToggle(postId),
        onMutate: async () => {
            await queryClient.cancelQueries(['post', postId]);
            const previousPost = queryClient.getQueryData(['post', postId]);

            queryClient.setQueryData(['post', postId], old => ({
                ...old,
                favorite: !old.favorite
            }));

            return { previousPost };
        },
        onError: (err, postId, context) => {
            queryClient.setQueryData(['post', postId], context.previousPost);
        },
        // onSettled: () => {
        //     queryClient.invalidateQueries(['post', postId]);
        // }
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const closeModal = () => {
        queryClient.invalidateQueries(['post/List']);
        if(delMutation.isSuccess){
            moveToList()
        }
    }

    const handleClickDelete = ()=>delMutation.mutate(postId)

    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)

    const handleLikeToggle = () => likeMutation.mutate(postId)

    const handleFavoriteToggle = () => favoriteMutation.mutate(postId)


    if (!post) {
        return <div>Loading..</div>;
    }

    return (
        <div className="card bg-base-100 shadow-xl relative z-0">
            {isFetching ? <FetchingModal /> : null}
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="card-title text-3xl">{post.title}</h1>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleLikeToggle} className="btn btn-ghost btn-circle">
                            {post.likeCount} {post.like ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6" />}
                        </button>
                        <button onClick={handleFavoriteToggle} className="btn btn-ghost btn-circle">
                            {post.favorite ? <StarIconSolid className="h-6 w-6 text-yellow-500" /> : <StarIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
                        <span>모집 인원: {post.capacity}명</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-green-500" />
                        <span>날짜: {new Date(post.meetingTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 mr-2 text-purple-500" />
                        <span>시간: {new Date(post.meetingTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-2 text-red-500" />
                        <span>장소: {post.placeName}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">활동 유형</h3>
                    <div className="badge badge-lg">{post.activityType}</div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">상세 내용</h3>
                    <p>{post.content}</p>
                </div>

                {post.imageList && post.imageList.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">이미지</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {post.imageList.map((image, index) => (
                                <img key={index} src={image} alt={`Image ${index + 1}`} className="w-full h-48 object-cover rounded" />
                            ))}
                        </div>
                    </div>
                )}


                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">집결 장소</h3>
                    <KakaoMapComponent placeName={post.placeName} latitude={post.latitude} longitude={post.longitude} />
                </div>



                <div className="card-actions justify-end space-x-2 mt-6">
                    <button className="btn btn-primary" onClick={() => navigate(`/post/${postId}/chat`)}>
                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2" />
                        채팅방 입장
                    </button>
                    <button className="btn btn-neutral" onClick={() => moveToModify(postId)}>
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        수정
                    </button>
                    <button className="btn btn-secondary" onClick={moveToList}>
                        <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                        목록
                    </button>
                    <button className="btn btn-error" onClick={toggleDeleteModal}>
                        <TrashIcon className="h-5 w-5 mr-2" />
                        삭제
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="modal modal-open z-50">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">게시물을 삭제 하시겠습니까?</h3>
                        <div className="modal-action py-5">
                            <button className="btn btn-outline btn-error" onClick={handleClickDelete}>Yes</button>
                            <button className="btn btn-outline btn-neutral" onClick={toggleDeleteModal}>No</button>
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggleDeleteModal}>✕</button>
                        </div>
                    </div>
                </div>
            )}
            {delMutation.isSuccess ?
                <ResultModal title={'게시글 삭제'} content={`게시물 삭제가 완료 되었습니다.`}
                             callbackFn={closeModal}/> : null}
        </div>
    );
}

export default ReadComponent;