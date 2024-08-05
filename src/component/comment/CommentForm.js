import React, { useState } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

export function CommentForm({isSubmitting,onSubmit}) {
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
        <div className="flex items-center">
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea textarea-bordered w-full h-24 resize-none"
          placeholder="댓글을 입력 해주세요."
          disabled={!isLogin}
      />
            <div className="ml-2">
                <button
                    className="btn btn-primary h-24 w-24"
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
