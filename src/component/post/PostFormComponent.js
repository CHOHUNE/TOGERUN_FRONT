import React, {useState, useEffect, useCallback} from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../../component/common/ResultModal";
import FetchingModal from "../common/FetchingModal";
import KakaoMapSearchComponent from "../kakaoMap/KakaoMapSearchComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useDropzone} from "react-dropzone";

const MAX_FILE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_FILE_TYPE = ['image/jpeg', 'image/png','image/jpg','image/gif'];
const ACTIVITY_TYPES=[
    'CLIMBING', 'RUNNING', 'HIKING', 'CYCLING', 'YOGA', 'PILATES', 'WEIGHT_TRAINING', 'SURFING'

]

const PostFormComponent = ({ initialPost, onSubmit, submitButtonText, title }) => {
    const [post, setPost] = useState({...initialPost,
    files:initialPost.imageList
    });
    const { moveToList } = useCustomMove();
    const queryClient = useQueryClient();

    const onDrop = useCallback(acceptedFiles => {
        const validFiles = acceptedFiles.filter(file =>
            file.size <= MAX_FILE_SIZE && ACCEPTED_FILE_TYPE.includes(file.type)
        );

        setPost(prevPost=>({
            ...prevPost,
            files:[...prevPost.files, ...validFiles]
        }))
    },[]);

    const {getRootProps,getInputProps,isDragActive} = useDropzone({
        onDrop,
        accept:ACCEPTED_FILE_TYPE.join(','),
        maxSize:MAX_FILE_SIZE
    });


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
        formData.append('activityType', post.activityType);
        formData.append('capacity', post.capacity);

        post.files.forEach((file,index)=>{
            formData.append(`uploadFiles`,file)
        })

        mutation.mutate(formData);

    };

    const handleRemoveFile = (index) => {
        setPost(prevPost => ({
            ...prevPost,
            files: prevPost.files.filter((_, i) => i !== index)
        }));
    }

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

                {/*데이트 피커 */}

                <div className="form-control ">
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

                {/* 액티비티 타입 */}
                <div className="form-control">
                    <label htmlFor="activityType" className="label">
                        <span className="label-text">활동 유형</span>
                    </label>
                    <select
                        id="activityType"
                        name="activityType"
                        value={post.activityType}
                        onChange={handleChangePost}
                        required
                        className="select select-bordered w-full"
                    >
                        <option value="">활동 유형을 선택하세요</option>
                        {ACTIVITY_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>


                {/*모집 정원*/}
                <div className="form-control">
                    <label htmlFor="capacity" className="label">
                        <span className="label-text">모집 정원</span>
                    </label>
                    <select
                        id="capacity"
                        name="capacity"
                        value={post.capacity}
                        onChange={handleChangePost}
                        required
                        className="select select-bordered w-full"
                    >
                        <option value="">모집 정원을 선택하세요</option>
                        {[...Array(50)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}명</option>
                        ))}
                    </select>
                </div>


                {/* 장소 검색*/}
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


                <div className="mt-10">  {/* 여기에 mt-10을 추가했습니다 */}
                    <h2 className="text-2xl font-bold  mb-4">집결 장소 검색</h2>
                    <div className="bg-base-200 p-4 rounded-lg">
                    <KakaoMapSearchComponent onPlaceSelect={handlePlaceSelect}/>
                    </div>
                </div>

                {/*파입 업로드 */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">이미지 업로드</span>
                    </label>
                    <div {...getRootProps()}
                         className={`p-4 border-2 border-dashed rounded-md h-48 flex items-center justify-center ${isDragActive ? 'border-primary' : 'border-gray-300'}`}>
                        <input {...getInputProps()} />
                        <div className="text-center">
                            {isDragActive ?
                                <p>파일을 여기에 놓으세요...</p> :
                                <p>파일을 여기에 드래그하거나 클릭하여 선택하세요.
                                    <br/>
                                    (최대 5MB, JPG/PNG/GIF)</p>
                            }
                        </div>
                    </div>
                    {post.files.length > 0 && (
                        <div className="mt-2 max-h-48 overflow-y-auto">
                            <h4>선택된 파일:</h4>
                            <ul>
                                {post.files.map((file, index) => (
                                    <li key={index} className="flex items-center space-x-2 my-2">
                                        <img src={URL.createObjectURL(file)} alt={file.name}
                                             className="w-10 h-10 object-cover"/>
                                        <span className="flex-grow">{file.name}</span>
                                        <button type="button" onClick={() => handleRemoveFile(index)}
                                                className="text-red-500 hover:text-red-700">삭제
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>


                <button type="submit" className="btn btn-primary w-full">게시글 작성</button>
            </form>
        </div>
    );
};

export default PostFormComponent;