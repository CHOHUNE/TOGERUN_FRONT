import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCommentAPI, deleteCommentAPI, modifyCommentAPI } from "../api/api";

export const useCommentHook = (postId, setIsSubmitting, setIsEditing) => {
    const queryClient = useQueryClient();

    const addComment = useMutation({
        mutationFn: (newComment) => addCommentAPI(newComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            alert("등록 성공");
            setIsSubmitting(false);
        },
        onError: () => {
            alert("로그인 후 이용 해주세요.");
            setIsSubmitting(false);
        },
    });

    const deleteComment = useMutation({
        mutationFn: (commentId) => deleteCommentAPI(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            alert("삭제 성공");
            setIsSubmitting(false);
        },
        onError: () => {
            alert("실패");
            setIsSubmitting(false);
        },
    });

    const editComment = useMutation({
        mutationFn: (editedComment) => modifyCommentAPI(editedComment),
        onSuccess: () => {
            queryClient.invalidateQueries("comment");
            alert("댓글이 성공적으로 수정되었습니다.");
        },
        onError: () => {
            alert("댓글 수정 중 오류가 발생했습니다.");
        },
        onSettled: () => {
            setIsSubmitting(false);
            setIsEditing(false);
        },
    });

    const handleAddComment = (content,parentId) => {
        setIsSubmitting(true);
        addComment.mutate({
            post_id: postId,
            content: content,
            parent_id: parentId,
        });
    };

    const handleDeleteComment = (commentId) => {
        setIsSubmitting(true);
        deleteComment.mutate(commentId);
    };

    const handleEditComment = (commentId, content) => {
        setIsSubmitting(true);
        editComment.mutate({
            id: commentId,
            content: content,
            // created_by: loginState.email
        });
    };

    // const handleDuplicateSubmit = (replyComment, gameBoardId) => {
    //     setIsSubmitting(true);
    //     addComment.mutate({
    //         content: replyComment,
    //         post_id: gameBoardId,
    //         parent_id: null,
    //     });
    // };

    return {

        handleAddComment,
        handleDeleteComment,
        handleEditComment,
        // handleDuplicateSubmit,
    };
};