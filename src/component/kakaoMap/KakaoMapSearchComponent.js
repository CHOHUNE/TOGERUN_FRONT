import React, { useState, useEffect, useRef } from 'react';
import { loadKakaoMapScript } from "../../kakaoMapLoader";


// KakaoMapSearch 컴포넌트: 카카오맵 API를 사용하여 장소를 검색하고 결과를 지도와 목록으로 표시
const KakaoMapSearch = ({onPlaceSelect}) => {
    // 상태 변수들
    const [keyword, setKeyword] = useState('연세대학교 대운동장'); // 검색 키워드
    const [places, setPlaces] = useState([]); // 검색된 장소들
    const [pagination, setPagination] = useState(null); // 페이지네이션 정보
    const [mapLoaded, setMapLoaded] = useState(false); // 카카오맵 스크립트 로드 상태
    const [map, setMap] = useState(null); // 카카오맵 객체
    const [hoveredMarker, setHoveredMarker] = useState(null); // 현재 호버 중인 마커

    // ref 변수들
    const mapRef = useRef(null); // 지도를 표시할 DOM 요소
    const markersRef = useRef({}); // 마커들을 저장할 객체 (키: 장소 ID, 값: 마커 객체)
    const customOverlayRef = useRef(null); // 커스텀 오버레이 객체

    // 컴포넌트 마운트 시 카카오맵 스크립트 로드
    useEffect(() => {
        loadKakaoMapScript(() => {
            setMapLoaded(true);
        });
    }, []);

    // 카카오맵 스크립트 로드 완료 시 지도 초기화
    useEffect(() => {
        if (mapLoaded && window.kakao && window.kakao.maps) {
            initializeMap();
        }
    }, [mapLoaded]);

    // 지도 초기화 함수
    const initializeMap = () => {
        const mapContainer = mapRef.current;
        const mapOption = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청
            level: 3 // 지도 확대 레벨
        };

        const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(newMap);
        const ps = new window.kakao.maps.services.Places();

        // 초기 검색 수행
        searchPlaces(newMap, ps);
    }

    // 장소 검색 함수
    const searchPlaces = (map, ps) => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            alert('키워드를 입력해주세요!');
            return false;
        }

        // 키워드로 장소 검색
        ps.keywordSearch(keyword, (data, status, pagination) => placesSearchCB(data, status, pagination, map), {size: 10});
    };

    // 장소 검색 콜백 함수
    const placesSearchCB = (data, status, pagination, map) => {
        if (status === window.kakao.maps.services.Status.OK) {
            // 검색 성공 시 결과 표시
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

    // 검색된 장소 표시 함수
    const displayPlaces = (places, map) => {
        const bounds = new window.kakao.maps.LatLngBounds();
        removeMarker();

        places.forEach((place, index) => {
            const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = addMarker(placePosition, index, map, place);
            bounds.extend(placePosition);
        });

        // 모든 마커가 보이도록 지도 범위 재설정
        map.setBounds(bounds);
        setPlaces(places);
    };

    // 마커 추가 함수
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

        // 마커 클릭 이벤트 리스너
        window.kakao.maps.event.addListener(marker, 'click', function () {
            handlePlaceSelection(place, map);
        });

        // 마커 마우스오버 이벤트 리스너
        window.kakao.maps.event.addListener(marker, 'mouseover', function () {
            setHoveredMarker(marker);
            displayCustomOverlay(marker, place.place_name, map);
        });

        // 마커 마우스아웃 이벤트 리스너
        window.kakao.maps.event.addListener(marker, 'mouseout', function () {
            setHoveredMarker(null);
            if (customOverlayRef.current) {
                customOverlayRef.current.setMap(null);
            }
        });

        return marker;
    };

    // 모든 마커 제거 함수
    const removeMarker = () => {
        Object.values(markersRef.current).forEach(marker => {
            marker.setMap(null);
        });
        markersRef.current = {};
    };

    // 커스텀 오버레이 표시 함수
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

    // 장소 선택 처리 함수 (마커 클릭 또는 목록 클릭 시 호출)
    const handlePlaceSelection = (place, map) => {
        const marker = markersRef.current[place.id];
        if (marker) {
            const moveLatLon = marker.getPosition();

            // 부드럽게 해당 위치로 이동
            map.panTo(moveLatLon);

            // 0.5초 후에 중앙으로 정확히 이동하고 확대
            setTimeout(() => {
                map.setCenter(moveLatLon);
                map.setLevel(3, {animate: true});
            }, 500);

            displayCustomOverlay(marker, place.place_name, map);
            onPlaceSelect(place); // 선택된 장소 정보를 부모 컴포넌트로 전달
        }
    };

    // 검색 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        if (mapLoaded && window.kakao && window.kakao.maps && map) {
            const ps = new window.kakao.maps.services.Places();
            searchPlaces(map, ps);
        }
    };

    // 목록에서 장소 클릭 핸들러
    const handlePlaceClick = (place) => {
        if (map) {
            handlePlaceSelection(place, map);
        }
    };

    // 컴포넌트 렌더링
// ... (이전 코드 유지)

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 지도 영역 - 높이 증가 */}
                <div className="lg:col-span-2">
                    <div ref={mapRef} className="w-full h-[600px] rounded-lg shadow-lg"></div>
                </div>
                {/* 검색 및 결과 목록 영역 */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-xl h-[600px] flex flex-col">
                        <div className="card-body flex-none">
                            <h2 className="card-title">장소 검색</h2>
                            {/* 검색 폼 */}
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
                        </div>
                        <div className="divider my-0"></div>
                        {/* 검색 결과 목록 - 스크롤바 항상 표시 */}

                        <div className={`flex-grow overflow-y-scroll pr-2 `}
                             style={{scrollbarGutter: 'stable'}}>

                            <ul className="menu bg-base-200 rounded-box p-2">
                                {places.map((place, index) => (
                                    <li key={place.id}>
                                        <button
                                            onClick={() => handlePlaceClick(place)}
                                            onMouseEnter={() => setHoveredMarker(markersRef.current[place.id])}
                                            onMouseLeave={() => setHoveredMarker(null)}
                                            className={`hover:bg-base-300 w-full text-left py-2 ${hoveredMarker === markersRef.current[place.id] ? 'bg-base-300' : ''}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-bold">{index + 1}. {place.place_name}</span>
                                                <span
                                                    className="text-sm">{place.road_address_name || place.address_name}</span>
                                                <span className="text-sm text-info">{place.phone}</span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* 페이지네이션 */}
                        <div className="card-body flex-none pt-2">
                            <div className="btn-group justify-center">
                                {pagination && Array.from({length: pagination.last}, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        className={`btn btn-sm ${page === pagination.current ? 'btn-active' : ''}`}
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
}


export default KakaoMapSearch;