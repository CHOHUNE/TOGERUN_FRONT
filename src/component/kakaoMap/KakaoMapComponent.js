import React, { useEffect, useRef, useState } from 'react';
import {loadKakaoMapScript} from "../../kakaoMapLoader";



const KakaoMap = ({latitude,longitude,placeName}) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);


        useEffect(() => {
        if (!mapLoaded) {
            loadKakaoMapScript(() => {
                setMapLoaded(true);
            });
        }
    }, [mapLoaded]);



    useEffect(() => {
        if (mapLoaded && mapRef.current && latitude && longitude) {
            // const { kakao } = window;

            const options = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 3
            };

            const map = new window.kakao.maps.Map(mapRef.current, options);

            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const marker = new window.kakao.maps.Marker({
                position: markerPosition
            });

            marker.setMap(map);

            if (placeName) {
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;">${placeName}</div>`
                });
                infowindow.open(map, marker);
            }
        }
    }, [mapLoaded, latitude, longitude, placeName]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default KakaoMap;