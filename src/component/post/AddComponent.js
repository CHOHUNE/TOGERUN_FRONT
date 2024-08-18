import React, {useState} from 'react';
import {postAdd} from "../../api/api";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../../component/common/ResultModal";
import FetchingModal from "../common/FetchingModal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postInitState} from "../../atoms/postInitState";
import axios from "axios";
import KakaoMapComponent from "../kakaoMap/KakaoMapComponent";
import KakaoMapSearchComponent from "../kakaoMap/KakaoMapSearchComponent";



const AddComponent = () => {

    const [post, setPost] = useState({...postInitState})
    const {moveToList} = useCustomMove();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([])


    const addMutation = useMutation({
        mutationFn:(post)=>postAdd(post)
    });

    const handleChangePost = (e) => {
        const {name, value} = e.target;

        setPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit =(e) => {

        e.preventDefault()

        const formData = new FormData();

        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('latitude', post.latitude)
        formData.append('longitude', post.longitude)
        formData.append('placeName', post.placeName);

        addMutation.mutate(formData)

    };

    const handleSearchPlace = async() =>{
        try{
            const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json',{

                params:{query:searchKeyword},
                headers:{Authorization:'KakaoAK 995dc1e3b670dee696867930fef19998'}
            })

            setSearchResults(response.data.documents)

        }catch(error){
            console.error('Error Searching places',error)
        }
    }

    const handleSelectPlace = (place) => {
        setPost(prevState => ({
            ...prevState,
            latitude: parseFloat(place.y),
            longitude: parseFloat(place.x),
            placeName: place.place_name
        }));
        setSearchResults([]);
    }


    const queryClient = useQueryClient();


    const closeModal = () => {
        // setResult(null)
        queryClient.invalidateQueries('post/List')
        moveToList({page:1})
    }

    return (
    <div>
        {addMutation.isPending ? <FetchingModal/> : <></>}
        {addMutation.isSuccess ? <ResultModal title={'게시글 작성'} content={` 게시물 작성이 완료 되었습니다.`} callbackFn={closeModal}/> : <></> }
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-3xl font-bold mb-4">Create Post</h1>


                <div className="form-control">
                    <label htmlFor="title" className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name={"title"}
                        value={post.title}
                        onChange={handleChangePost}
                        required
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="content" className="label">
                        <span className="label-text">Content</span>
                    </label>
                    <textarea
                        id="content"
                        name={"content"}
                        value={post.content}
                        onChange={handleChangePost}
                        required
                        className="textarea textarea-bordered"
                    />
                </div>

                {/*<div className="form-control">*/}
                {/*    <label htmlFor="placeSearch" className="label">*/}
                {/*        <span className="label-text">Search Place</span>*/}
                {/*    </label>*/}
                {/*    /!*<div className="flex">*!/*/}
                {/*    /!*    <input*!/*/}
                {/*    /!*        id="placeSearch"*!/*/}
                {/*    /!*        type="text"*!/*/}
                {/*    /!*        value={searchKeyword}*!/*/}
                {/*    /!*        onChange={(e) => setSearchKeyword(e.target.value)}*!/*/}
                {/*    /!*        className="input input-bordered flex-grow"*!/*/}
                {/*    /!*    />*!/*/}
                {/*    /!*    <button type="button" onClick={handleSearchPlace} className="btn btn-primary ml-2">Search</button>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*</div>*/}
                {/*<KakaoMapComponent latitude={37.5665} longitude={126.9780} placeName={"집결 장소"} />*/}
                <KakaoMapSearchComponent/>
                {/*{searchResults.length > 0 && (*/}
                {/*    <ul className="menu bg-base-200 w-full rounded-box">*/}
                {/*        {searchResults.map((place) => (*/}
                {/*            <li key={place.id}>*/}
                {/*                <a onClick={() => handleSelectPlace(place)}>{place.place_name}</a>*/}
                {/*            </li>*/}
                {/*        ))}*/}
                {/*    </ul>*/}
                {/*)}*/}
                {/*{post.placeName && (*/}
                {/*    <div className="alert alert-info">*/}
                {/*        <span>Selected place: {post.placeName}</span>*/}
                {/*    </div>*/}
                {/*)}*/}

                <button type="submit" className="btn btn-primary" >Create</button>

            </form>
    </div>
    );
};

export default AddComponent;
