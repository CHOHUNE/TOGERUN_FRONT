import React, { useState, useEffect, useRef } from 'react';
import { loadKakaoMapScript } from "../../kakaoMapLoader";

const KakaoMapSearch = ({ onPlaceSelect }) => {
    const [keyword, setKeyword] = useState('이태원 맛집');
    const [places, setPlaces] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [hoveredMarker, setHoveredMarker] = useState(null);

    const mapRef = useRef(null);
    const markersRef = useRef({});
    const customOverlayRef = useRef(null);

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

        const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(newMap);
        const ps = new window.kakao.maps.services.Places();

        searchPlaces(newMap, ps);
    }

    const searchPlaces = (map, ps) => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }

        ps.keywordSearch(keyword, (data, status, pagination) => placesSearchCB(data, status, pagination, map), { size: 10 });
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
        const bounds = new window.kakao.maps.LatLngBounds();
        removeMarker();

        places.forEach((place, index) => {
            const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = addMarker(placePosition, index, map, place);
            bounds.extend(placePosition);
        });

        map.setBounds(bounds);
        setPlaces(places);
    };

    const addMarker = (position, idx, map, place) => {
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
        const imageSize = new window.kakao.maps.Size(36, 37);
        const imgOptions = {
            spriteSize: new window.kakao.maps.Size(36, 691),
            spriteOrigin: new window.kakao.maps.Point(0, (idx * 46) + 10),
            offset: new window.kakao.maps.Point(13, 37)
        };
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        const marker = new window.kakao.maps.Marker({
            position: position,
            image: markerImage
        });

        marker.setMap(map);
        markersRef.current[place.id] = marker;

        window.kakao.maps.event.addListener(marker, 'click', function() {
            handlePlaceSelection(place, map);
        });

        window.kakao.maps.event.addListener(marker, 'mouseover', function() {
            setHoveredMarker(marker);
            displayCustomOverlay(marker, place.place_name, map);
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', function() {
            setHoveredMarker(null);
            if (customOverlayRef.current) {
                customOverlayRef.current.setMap(null);
            }
        });

        return marker;
    };

    const removeMarker = () => {
        Object.values(markersRef.current).forEach(marker => {
            marker.setMap(null);
        });
        markersRef.current = {};
    };

    const displayCustomOverlay = (marker, title, map) => {
        if (customOverlayRef.current) {
            customOverlayRef.current.setMap(null);
        }

        const content = document.createElement('div');
        content.innerHTML = `
            <div style="padding:5px;background:white;border-radius:3px;box-shadow:0 2px 4px rgba(0,0,0,0.2);font-size:12px;">
                ${title}
            </div>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
            content: content,
            position: marker.getPosition(),
            zIndex: 99
        });

        customOverlay.setMap(map);
        customOverlayRef.current = customOverlay;
    };

    const handlePlaceSelection = (place, map) => {
        const marker = markersRef.current[place.id];
        if (marker) {
            const moveLatLon = marker.getPosition();

            map.panTo(moveLatLon);

            setTimeout(() => {
                map.setCenter(moveLatLon);
                map.setLevel(3, {animate: true});
            }, 500);

            displayCustomOverlay(marker, place.place_name, map);
            onPlaceSelect(place);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mapLoaded && window.kakao && window.kakao.maps && map) {
            const ps = new window.kakao.maps.services.Places();
            searchPlaces(map, ps);
        }
    };

    const handlePlaceClick = (place) => {
        if (map) {
            handlePlaceSelection(place, map);
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
                                    <li key={place.id}>
                                        <button
                                            onClick={() => handlePlaceClick(place)}
                                            onMouseEnter={() => setHoveredMarker(markersRef.current[place.id])}
                                            onMouseLeave={() => setHoveredMarker(null)}
                                            className={`hover:bg-base-300 w-full text-left ${hoveredMarker === markersRef.current[place.id] ? 'bg-base-300' : ''}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold">{index + 1}. {place.place_name}</span>
                                                <span className="text-sm">{place.road_address_name || place.address_name}</span>
                                                <span className="text-sm text-info">{place.phone}</span>
                                            </div>
                                        </button>
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