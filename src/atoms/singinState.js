import {atom} from "recoil";
import {getCookie} from "../util/cookieUtil";


const initState = {
    email:'',
    nickname:'',
    accessToken:'',
    refreshToken:'',
    // chatRooms:[],
    // activeChatRoomId:null,
    // unreadMessages:{},
// 위 전역 상태 값에 참가한 채팅 목록, 더 추가하면 읽지 않은 알림 정도를 추가할 수 있음
}


const loadMemberCookie =() =>{

    const memberInfo = getCookie('member')

    if (memberInfo && memberInfo.nickname) {
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname)

    }

    return memberInfo

}

export const signInState = atom({
    key:'signInState',
    default:loadMemberCookie()||initState
})

//- - - - - - - - atom 사용 예시 - - - - - - - - - -
// // 참가한 채팅방 목록
// export const chatRoomsState = atom({
//     key: 'chatRoomsState',
//     default: [],
// });
//
// // 현재 활성화된 채팅방 ID
// export const activeChatRoomIdState = atom({
//     key: 'activeChatRoomIdState',
//     default: null,
// });
//
// // 읽지 않은 메시지 수
// export const unreadMessagesState = atom({
//     key: 'unreadMessagesState',
//     default: {},
// });
// - - - - - - - 상태값 주입 예시  --  - - - - -
// const handleJoinChatRoom = (chatRoom) => {
//     setChatRooms((prevRooms) => [...prevRooms, chatRoom]);
// };
//
// const handleSetActiveChatRoom = (chatRoomId) => {
//     setActiveChatRoomId(chatRoomId);
// };
//
// const handleAddUnreadMessage = (chatRoomId) => {
//     setUnreadMessages((prevMessages) => ({
//         ...prevMessages,
//         [chatRoomId]: (prevMessages[chatRoomId] || 0) + 1,
//     }));
// };


