import React, { useState } from 'react';
import { postAdd } from "../../api/api";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../../component/common/ResultModal";
import FetchingModal from "../common/FetchingModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postInitState } from "../../atoms/postInitState";
import KakaoMapSearchComponent from "../kakaoMap/KakaoMapSearchComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddComponent = () => {
    const [post, setPost] = useState({...postInitState})
    const { moveToList } = useCustomMove();

    const addMutation = useMutation({
        mutationFn: (post) => postAdd(post)
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
        e.preventDefault()

        const formData = new FormData();

        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('latitude', post.latitude)
        formData.append('longitude', post.longitude)
        formData.append('placeName', post.placeName);
        formData.append('meetingTime', post.meetingTime.toISOString().slice(0, 19));
        // "YYYY-MM-DDTHH:mm:ss" 형식으로 변환

        addMutation.mutate(formData)
    };

    const handlePlaceSelect = (place) => {
        setPost(prevState => ({
            ...prevState,
            latitude: parseFloat(place.y),
            longitude: parseFloat(place.x),
            placeName: place.place_name
        }));
    }

    const queryClient = useQueryClient();

    const closeModal = () => {
        queryClient.invalidateQueries('post/List')
        moveToList({page:1})
    }

    return (
        <div className="container mx-auto p-4">
            {addMutation.isPending ? <FetchingModal/> : <></>}
            {addMutation.isSuccess ? <ResultModal title={'게시글 작성'} content={` 게시물 작성이 완료 되었습니다.`} callbackFn={closeModal}/> : <></> }
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
                <KakaoMapSearchComponent onPlaceSelect={handlePlaceSelect} />
            </div>
        </div>
    );
};

export default AddComponent;