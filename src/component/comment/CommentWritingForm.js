import React, { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

export function CommentWritingForm({isSubmitting,onSubmit}) {
    const [content, setContent] = useState("");

    const {isLogin} = useCustomLogin();

    function handleSubmit() {
        if (!content.trim() || !content) {
            // 댓글이 비어있거나 공백만 포함된 경우, 제출하지 않음
            return;
        }

        onSubmit(content);
        setContent(""); // 제출 후 입력 필드 지우기
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea textarea-bordered w-full h-20 sm:h-24 resize-none text-sm sm:text-base"
                placeholder="댓글을 입력 해주세요."
                disabled={!isLogin}
            />
            <div className="mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto">
                <button
                    className="btn btn-primary w-full sm:w-24 h-12 sm:h-24 text-sm sm:text-base"
                    disabled={isSubmitting || !isLogin}
                    onClick={handleSubmit}
                    title={!isLogin ? "로그인 후 작성 가능 합니다. " : ""}
                >
                    쓰기
                </button>
            </div>
        </div>
    );
}
