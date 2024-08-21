import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../../component/common/ResultModal";
import FetchingModal from "../common/FetchingModal";
import KakaoMapSearchComponent from "../kakaoMap/KakaoMapSearchComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PostFormComponent = ({ initialPost, onSubmit, submitButtonText, title }) => {
    const [post, setPost] = useState(initialPost);
    const { moveToList } = useCustomMove();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: onSubmit,
        onSuccess: () => {
            queryClient.invalidateQueries('post/List');
            moveToList({ page: 1 });
        }
    });

    const handleChangePost = (e) => {
        const { name, value } = e.target;
        setPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleDateTimeChange = (date) => {
        setPost(prevState => ({
            ...prevState,
            meetingTime: date
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('content', post.content);
        formData.append('latitude', post.latitude);
        formData.append('longitude', post.longitude);
        formData.append('placeName', post.placeName);
        formData.append('meetingTime', post.meetingTime.toISOString().slice(0, 19));
        mutation.mutate(formData);
    };

    const handlePlaceSelect = (place) => {
        setPost(prevState => ({
            ...prevState,
            latitude: parseFloat(place.y),
            longitude: parseFloat(place.x),
            placeName: place.place_name
        }));
    }

    return (
        <div className="container mx-auto p-4">
            {mutation.isPending && <FetchingModal />}
            {mutation.isSuccess && (
                <ResultModal
                    title={title}
                    content={`${title}이 완료되었습니다.`}
                    callbackFn={() => moveToList({ page: 1 })}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-3xl font-bold mb-4">게시글 작성</h1>

                <div className="form-control">
                    <label htmlFor="title" className="label">
                        <span className="label-text">제목</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChangePost}
                        required
                        className="input input-bordered"
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="content" className="label">
                        <span className="label-text">내용</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleChangePost}
                        required
                        className="textarea textarea-bordered"
                        rows="5"
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="meetingTime" className="label">
                        <span className="label-text">집결 시간</span>
                    </label>
                    <DatePicker
                        id="meetingTime"
                        selected={post.meetingTime}
                        onChange={handleDateTimeChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={new Date()}
                        minTime={new Date(new Date().setHours(0, 0, 0, 0))}
                        maxTime={new Date(new Date().setHours(23, 59, 59, 999))}
                        filterTime={(time) => {
                            const currentDate = new Date();
                            const selectedDate = new Date(post.meetingTime);
                            return (
                                selectedDate.getDate() !== currentDate.getDate() ||
                                time.getTime() >= currentDate.getTime()
                            );
                        }}
                        className="input input-bordered w-full"
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="placeName" className="label">
                        <span className="label-text">집결장소</span>
                    </label>
                    <input
                        id="placeName"
                        type="text"
                        name="placeName"
                        value={post.placeName}
                        readOnly
                        className="input input-bordered"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full">게시글 작성</button>
            </form>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">집결 장소 검색</h2>
                <div className="bg-base-200 p-4 rounded-lg">
                    <KakaoMapSearchComponent onPlaceSelect={handlePlaceSelect}/>
                </div>
            </div>
        </div>
    );
};

export default PostFormComponent;