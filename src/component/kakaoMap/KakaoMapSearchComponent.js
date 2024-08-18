
import { loadKakaoMapScript } from "../../kakaoMapLoader";
import {useEffect, useRef, useState} from "react";

const KakaoMapSearch = () => {
    const [keyword, setKeyword] = useState('이태원 맛집');
    const [places, setPlaces] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef([]);
    const infowindowRef = useRef(null);

    useEffect(() => {
        loadKakaoMapScript(() => {
            setMapLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (mapLoaded && window.kakao && window.kakao.maps) {
            initializeMap();
        }
    }, [mapLoaded]);

    const initializeMap = () => {
        const mapContainer = mapRef.current;
        const mapOption = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        const ps = new window.kakao.maps.services.Places();

        infowindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        searchPlaces(map, ps);
    }

    const searchPlaces = (map, ps) => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }

        ps.keywordSearch(keyword, (data, status, pagination) => placesSearchCB(data, status, pagination, map));
    };

    const placesSearchCB = (data, status, pagination, map) => {
        if (status === window.kakao.maps.services.Status.OK) {
            displayPlaces(data, map);
            setPagination(pagination);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            return;
        } else if (status === window.kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
        }
    };

    const displayPlaces = (places, map) => {
        const bounds = new kakao.maps.LatLngBounds();
        removeMarker();

        for (let i = 0; i < places.length; i++) {
            const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
            const marker = addMarker(placePosition, i, map);
            bounds.extend(placePosition);

            (function(marker, title) {
                kakao.maps.event.addListener(marker, 'mouseover', function() {
                    displayInfowindow(marker, title, map);
                });

                kakao.maps.event.addListener(marker, 'mouseout', function() {
                    infowindowRef.current.close();
                });
            })(marker, places[i].place_name);
        }

        map.setBounds(bounds);
        setPlaces(places);
    };

    const addMarker = (position, idx, map) => {
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
        const imageSize = new kakao.maps.Size(36, 37);
        const imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691),
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
            offset: new kakao.maps.Point(13, 37)
        };
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        const marker = new kakao.maps.Marker({
            position: position,
            image: markerImage
        });

        marker.setMap(map);
        markerRef.current.push(marker);

        return marker;
    };

    const removeMarker = () => {
        for (let i = 0; i < markerRef.current.length; i++) {
            markerRef.current[i].setMap(null);
        }
        markerRef.current = [];
    };

    const displayInfowindow = (marker, title, map) => {
        const content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
        infowindowRef.current.setContent(content);
        infowindowRef.current.open(map, marker);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mapLoaded && window.kakao && window.kakao.maps) {
            const mapContainer = mapRef.current;
            const map = new window.kakao.maps.Map(mapContainer, { center: new window.kakao.maps.LatLng(37.566826, 126.9786567), level: 3 });
            const ps = new window.kakao.maps.services.Places();
            searchPlaces(map, ps);
        }
    };


    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div ref={mapRef} className="w-full h-96 lg:h-[calc(100vh-2rem)] rounded-lg shadow-lg"></div>
                </div>
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">장소 검색</h2>
                            <form onSubmit={handleSubmit} className="form-control">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        className="input input-bordered flex-grow"
                                        placeholder="검색어를 입력하세요"
                                    />
                                    <button type="submit" className="btn btn-primary">검색</button>
                                </div>
                            </form>
                            <div className="divider"></div>
                            <ul className="menu bg-base-200 rounded-box">
                                {places.map((place, index) => (
                                    <li key={index}>
                                        <a className="hover:bg-base-300">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{place.place_name}</span>
                                                <span className="text-sm">{place.road_address_name || place.address_name}</span>
                                                <span className="text-sm text-info">{place.phone}</span>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="btn-group justify-center mt-4">
                                {pagination && Array.from({ length: pagination.last }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`btn ${page === pagination.current ? 'btn-active' : ''}`}
                                        onClick={() => pagination.gotoPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KakaoMapSearch;