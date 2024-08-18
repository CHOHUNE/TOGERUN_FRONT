export const loadKakaoMapScript = (callback) => {

    const script = document.createElement('script')

    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7d721af7666bb8c5870d295c9c275b4e&autoload=false&libraries=services,clusterer`;
    script.async = true;

    script.onload = () => {
        window.kakao.maps.load(callback);
    };

    document.head.appendChild(script);
}