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

function ReadComponent({postId}) {

    const {data, isFetching} = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getOne(postId),
        staleTime: 1000 * 60 * 30
    });

    const queryClient = useQueryClient();

    const post = data || postInitState;

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
                like: !old.like
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
            {isFetching ? <FetchingModal/> : null}
            <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="card-title text-3xl">{post.title}</h1>
                    <div className="flex items-center space-x-2">

                        <button onClick={handleLikeToggle} className="btn btn-ghost btn-circle">
                            {post.likeCount}  {post.like ? <HeartIconSolid className="h-6 w-6 text-red-500" /> : <HeartIcon className="h-6 w-6" />}
                        </button>
                        <button onClick={handleFavoriteToggle} className="btn btn-ghost btn-circle">
                            {post.favorite ? <StarIconSolid className="h-6 w-6 text-yellow-500" /> : <StarIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl">{postId} 번 게시물</h3>
                    <span className="text-sm text-gray-500">{post.localDate}</span>
                </div>
                <KakaoMapComponent placeName={post.placeName} latitude={post.latitude} longitude={post.longitude} />
                <p className="mb-6">{post.content}</p>
                <div className="card-actions justify-end space-x-2">
                    <button className="btn btn-outline btn-primary" onClick={() => navigate(`/post/${postId}/chat`)}>
                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2" />
                        채팅방 입장
                    </button>
                    <button className="btn btn-outline btn-neutral" onClick={() => moveToModify(postId)}>
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        Modify
                    </button>
                    <button className="btn btn-outline btn-secondary" onClick={moveToList}>
                        <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                        Back
                    </button>
                    <button className="btn btn-outline btn-error" onClick={toggleDeleteModal}>
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Delete
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