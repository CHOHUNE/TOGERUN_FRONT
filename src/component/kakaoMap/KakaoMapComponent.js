import React, { useEffect, useRef, useState } from 'react';
import {loadKakaoMapScript} from "../../kakaoMapLoader";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getOne} from "../../api/api";
import {postInitState} from "../../atoms/postInitState";


const KakaoMap = (postId) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);


        const {data, isFetching} = useQuery({
            queryKey: ['post', postId],
            queryFn: () => getOne(postId),
            staleTime: 1000 * 60 * 30
        });

        const queryClient = useQueryClient();

        const post = data || postInitState;


        useEffect(() => {
        if (!mapLoaded) {
            loadKakaoMapScript(() => {
                setMapLoaded(true);
            });
        }
    }, [mapLoaded]);

    useEffect(() => {
        if (mapLoaded && mapRef.current && post.latitude && post.longitude) {
            const { kakao } = window;

            const options = {
                center: new kakao.maps.LatLng(post.latitude, post.longitude),
                level: 3
            };

            const map = new kakao.maps.Map(mapRef.current, options);

            const markerPosition = new kakao.maps.LatLng(post.latitude, post.longitude);
            const marker = new kakao.maps.Marker({
                position: markerPosition
            });

            marker.setMap(map);

            if (post.placeName) {
                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;">${post.placeName}</div>`
                });
                infowindow.open(map, marker);
            }
        }
    }, [mapLoaded, post.latitude, post.longitude, post.placeName]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default KakaoMap;