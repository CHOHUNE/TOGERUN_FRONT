export const postInitState = {
        title: '',
        content: '',
        delFlag: false,
        local_date: '',
        user: '',
        longitude: '',
        latitude: '',
        placeName: '',
        images:[],
        capacity:2,
        activityType:'',
        meetingTime: new Date(Math.ceil((new Date()).getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000))
        // 현재 시간 단위를 15분 단위로 가장 가까운 시간으로 올림하여 설정한다.
}