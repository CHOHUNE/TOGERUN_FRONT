import React, {useState, useEffect, useCallback} from 'react';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../../component/common/ResultModal";
import FetchingModal from "../common/FetchingModal";
import KakaoMapSearchComponent from "../kakaoMap/KakaoMapSearchComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useDropzone} from "react-dropzone";

const MAX_FILE_SIZE = 1024 * 1024 * 10;
const ACCEPTED_FILE_TYPES = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif']
};

const ACTIVITY_TYPES = [
    {name: '등산', value: 'CLIMBING'},
    {name: '달리기', value: 'RUNNING'},
    {name: '하이킹', value: 'HIKING'},
    {name: '자전거', value: 'CYCLING'},
    {name: '요가', value: 'YOGA'},
    {name: '필라테스', value: 'PILATES'},
    {name: '웨이트 트레이닝', value: 'WEIGHT_TRAINING'},
    {name: '서핑', value: 'SURFING'}
];

const PostFormComponent = ({initialPost, onSubmit, submitButtonText, title}) => {
    const [post, setPost] = useState({
        ...initialPost,
        images: initialPost.imageList ? initialPost.imageList.map(url => ({type: 'url', content: url})) : []
    });
    const {moveToList} = useCustomMove();
    const queryClient = useQueryClient();

    const onDrop = useCallback(acceptedFiles => {
        const validFiles = acceptedFiles.filter(file =>
            file.size <= MAX_FILE_SIZE && Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)
        ).map(file => ({ type: 'file', content: file }));

        setPost(prevPost => ({
            ...prevPost,
            images: [...prevPost.images, ...validFiles]
        }));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES,
        maxSize: MAX_FILE_SIZE
    });

    const mutation = useMutation({
        mutationFn: onSubmit,
        onSuccess: () => {
            queryClient.invalidateQueries('post/List');
            moveToList({page: 1});
        }
    });

    const handleChangePost = (e) => {
        const {name, value} = e.target;
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
        Object.keys(post).forEach(key => {
            if (key !== 'images') {
                if (key === 'meetingTime') {
                    const isoString = post[key].toISOString();
                    formData.append(key, isoString);
                } else {
                    formData.append(key, post[key]);
                }
            }
        });

        post.images.forEach((image, index) => {
            if (image.type === 'file') {
                formData.append(`uploadFiles`, image.content);
            } else {
                formData.append(`existingImageUrls`, image.content);
            }
        });
        mutation.mutate(formData);
    };

    const handleRemoveImage = (index) => {
        setPost(prevPost => ({
            ...prevPost,
            images: prevPost.images.filter((_, i) => i !== index)
        }));
    };

    const handlePlaceSelect = (place) => {
        setPost(prevState => ({
            ...prevState,
            latitude: parseFloat(place.y),
            longitude: parseFloat(place.x),
            placeName: place.place_name,
            roadName: place.road_address_name
        }));
    }

    return (
        <div className="container mx-auto p-4">
            {mutation.isPending && <FetchingModal/>}
            {mutation.isSuccess && (
                <ResultModal
                    title={title}
                    content={`${title}이 완료되었습니다.`}
                    callbackFn={() => moveToList({page: 1})}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <h1 className="text-3xl font-bold mb-6">게시글 작성</h1>

                <div className="form-control">
                    <label htmlFor="title" className="label">
                        <span className="label-text font-semibold">제목</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={post.title}
                        onChange={handleChangePost}
                        required
                        className="input input-bordered w-full"
                        placeholder="제목을 입력하세요"
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="content" className="label">
                        <span className="label-text font-semibold">내용</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleChangePost}
                        required
                        className="textarea textarea-bordered h-24"
                        placeholder="내용을 입력하세요"
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="meetingTime" className="label">
                        <span className="label-text font-semibold">집결 시간</span>
                    </label>
                    <DatePicker
                        id="meetingTime"
                        selected={post.meetingTime}
                        onChange={handleDateTimeChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeZone={"Asia/Seoul"}
                        timeIntervals={15}
                        timeCaption="시간"
                        dateFormat="yyyy년 MM월 dd일 HH:mm"
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
                    <label htmlFor="activityType" className="label">
                        <span className="label-text font-semibold">활동 유형</span>
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
                            <option key={type.value} value={type.value}>{type.name}</option>
                        ))}
                    </select>
                </div>


                <div className="form-control">
                    <label htmlFor="capacity" className="label">
                        <span className="label-text font-semibold">모집 정원</span>
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

                <div className="form-control">
                    <label htmlFor="placeName" className="label">
                        <span className="label-text font-semibold">집결장소</span>
                    </label>
                    <input
                        id="placeName"
                        type="text"
                        name="placeName"
                        value={post.placeName}
                        readOnly
                        className="input input-bordered w-full"
                        placeholder="아래 지도에서 장소를 선택하세요"
                    />
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">집결 장소 검색</h2>
                    <div className="bg-base-200 p-4 rounded-lg shadow-inner">
                        <KakaoMapSearchComponent onPlaceSelect={handlePlaceSelect}/>
                    </div>
                </div>

                <div className="form-control mt-6">
                    <label className="label">
                        <span className="label-text font-semibold">이미지 업로드</span>
                    </label>
                    <div {...getRootProps()}
                         className={`p-6 border-2 border-dashed rounded-lg h-40 flex items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}`}>
                        <input {...getInputProps()} />
                        <div className="text-center">
                            {isDragActive ?
                                <p className="text-primary">파일을 여기에 놓으세요...</p> :
                                <p>파일을 여기에 드래그하거나 클릭하여 선택하세요.<br/>
                                    <span className="text-sm text-gray-500">(최대 10MB, JPG/PNG/GIF)</span></p>
                            }
                        </div>
                    </div>
                    {post.images.length > 0 && (
                        <div className="mt-4 max-h-60 overflow-y-auto p-4 bg-base-200 rounded-lg">
                            <h4 className="font-semibold mb-2">이미지 미리보기:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {post.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image.type === 'file' ? URL.createObjectURL(image.content) : image.content}
                                            alt={image.type === 'file' ? image.content.name : `Image ${index}`}
                                            className="w-full h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-full">게시글 작성</button>
            </form>
        </div>
    );
};

export default PostFormComponent;