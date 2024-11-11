import React, {useEffect, useState} from 'react';
import ResultModal from "../common/ResultModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import {checkMemberNickname, getMember, modifyMember} from "../../api/memberAPI";
import {UserCircleIcon} from "@heroicons/react/20/solid";
import {UserIcon} from "@heroicons/react/24/outline";
import {useNavigate} from "react-router-dom";
import CustomModal from "../common/CustomModal";

const initState = {
    id: '',
    email: '',
    pw: '',
    name: '',
    nickname: '',
    social: false,
    gender: '',
    age: '',
    phone1: '',
    phone2: '',
    phone3: '',
    img: '',
};

function MemberModifyComponent() {
    const [user, setUser] = useState(initState);
    const [originalUser, setOriginalUser] = useState(initState);
    const {loginState} = useCustomLogin();
    const [result, setResult] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [showInfoModal, setShowInfoModal] = useState(false);

    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);


    useEffect(() => {
        const fetchMemberData = async () => {
            if (loginState) {
                try {
                    const memberData = await getMember();
                    const [phone1, phone2, phone3] = memberData.mobile ? memberData.mobile.split('-') : ['', '', ''];
                    const userData = {
                        ...initState, ...memberData, phone1, phone2, phone3,
                    };
                    setUser(userData);
                    setOriginalUser(userData);

                    if (memberData.social || !memberData.gender || !memberData.age) {
                        setShowInfoModal(true);
                    }


                } catch (error) {
                    console.error("회원 데이터 가져오기 오류:", error);
                    setResult("오류");
                }
            }
        };
        fetchMemberData()
    }, [loginState]);

    const handleInfoModalClose = () => {
        setShowInfoModal(false);
    };

    const handleInfoModalConfirm = () => {
        setShowInfoModal(false);
        // 모달이 닫힌 후에도 페이지에 남아있으므로 별도의 처리는 필요없음
    };


    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({...user, [name]: value});
        if (name === 'nickname') {
            validateNickname(value);
            setIsNicknameAvailable(null); // 닉네임이 변경될 때마다 중복 확인 상태 초기화
        } else if (name === 'phone1') {
            validatePhone1(value);
        }
    };

    const validateNickname = (nickname) => {
        if (/[!@#$%^&*(),.?":{}|<>]/.test(nickname)) {
            setErrors(prev => ({...prev, nickname: '특수문자는 사용할 수 없습니다.'}));
        } else {
            setErrors(prev => ({...prev, nickname: ''}));
        }
    };

    const validatePhone1 = (phone1) => {
        if (phone1 !== '010') {
            setErrors(prev => ({...prev, phone1: '전화번호는 010으로 시작해야 합니다.'}));
        } else {
            setErrors(prev => ({...prev, phone1: ''}));
        }
    };

    const checkNicknameAvailability = async () => {
        if (!user.nickname || user.nickname === originalUser.nickname) {
            return;
        }
        setIsCheckingNickname(true);
        try {
            const response = await checkMemberNickname(user.nickname);
            setIsNicknameAvailable(response.available);  // 직접 available 값을 사용

            console.log("Checking nickname:", user.nickname);
            console.log("API response:", response);
        } catch (error) {
            console.error("닉네임 중복 확인 오류:", error);
            setIsNicknameAvailable(false);
        } finally {
            setIsCheckingNickname(false);
        }
    };


    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['nickname', 'gender', 'age', 'phone1', 'phone2', 'phone3'];
        requiredFields.forEach(field => {
            if (!user[field]) {
                newErrors[field] = '필수 입력 항목입니다.';
            }
        });

        if (user.phone1 !== '010') {
            newErrors.phone1 = '전화번호는 010으로 시작해야 합니다.';
        }

        if (user.nickname === ''|| user.nickname === "DefaultUser") {
            newErrors.nickname = '닉네임을 입력 해주세요.';
        }
        if (user.gender === "Unspecified" || user.gender === "") {
            newErrors.gender = '성별을 선택 해주세요.';
        }
        if (user.age === "0"|| user.age === "") {
            newErrors.age = '연령대를 선택 해주세요.';
        }

        if (user.nickname !== originalUser.nickname && isNicknameAvailable !== true) {
            newErrors.nickname = '사용 가능한 닉네임이어야 합니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClickModify = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (user.nickname !== originalUser.nickname && isNicknameAvailable !== true) {
                setErrors(prev => ({...prev, nickname: '사용 가능한 닉네임이어야 합니다.'}));
                return;
            }
            try {
                const updatedUser = {
                    email: user.email,
                    nickname: user.nickname,
                    gender: user.gender,
                    age: user.age,
                    mobile: `${user.phone1}-${user.phone2}-${user.phone3}`,
                };

                await modifyMember(updatedUser);
                setResult("Modified");
            } catch (error) {
                console.error("Error modifying user:", error);
                setResult("Error");
            }
        }
    };



    const closeModal = () => {
        setResult(null);
        navigate('/');
    };

    return (
        <div className="container mx-auto px-4 py-8">

            {showInfoModal && (
                <ResultModal
                    title="회원 정보 입력 필요"
                    content="회원 정보 입력을 완료해 주세요."
                    callbackFn={handleInfoModalConfirm}
                />
            )}


            {result && (
                <ResultModal
                    title={'회원정보 수정'}
                    content={result === "Modified" ? `${user.name} 님의 회원정보가 수정되었습니다.` : "회원정보 수정 중 오류가 발생했습니다."}
                    callbackFn={closeModal}
                />
            )}



            <form onSubmit={handleClickModify} className="bg-white shadow-md rounded px-4 sm:px-8 pt-6 pb-8 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col items-center justify-center">
                        <UserIcon className="h-10 w-10 sm:h-12 sm:w-12 text-white mb-2 sm:mb-4" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">회원정보 수정</h1>
                    </div>
                    <p className="text-white text-center mt-2 opacity-80 text-sm sm:text-base">프로필을 업데이트하고 계정을 관리하세요</p>
                </div>

                <div className="flex justify-center mb-6">
                    {user.img ? (
                        <img
                            src={user.img}
                            alt="Profile"
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-500"
                        />
                    ) : (
                        <UserCircleIcon className="w-24 h-24 sm:w-32 sm:h-32 text-purple-500"/>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            이메일
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={user.email}
                            readOnly
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pw">
                            비밀번호
                        </label>
                        <input
                            id="pw"
                            type="password"
                            name="pw"
                            value={user.pw}
                            readOnly
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            이름
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={user.name}
                            readOnly
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nickname">
                            닉네임
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <input
                                id="nickname"
                                type="text"
                                name="nickname"
                                value={user.nickname}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 sm:mb-0 sm:mr-2"
                            />
                            <button
                                type="button"
                                onClick={checkNicknameAvailability}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
                                disabled={isCheckingNickname || !user.nickname || user.nickname === originalUser.nickname}
                            >
                                {isCheckingNickname ? '확인 중...' : '중복 확인'}
                            </button>
                        </div>
                        {errors.nickname && <p className="text-red-500 text-xs italic mt-1">{errors.nickname}</p>}
                        {isNicknameAvailable !== null && !errors.nickname && (
                            <p className={`text-xs italic mt-1 ${isNicknameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                                {isNicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                            성별
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">선택</option>
                            <option value="M">남성</option>
                            <option value="F">여성</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs italic mt-1">{errors.gender}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                            연령대
                        </label>
                        <select
                            id="age"
                            name="age"
                            value={user.age}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">선택</option>
                            <option value="20-29">20~29</option>
                            <option value="30-39">30~39</option>
                            <option value="40-49">40~49</option>
                        </select>
                        {errors.age && <p className="text-red-500 text-xs italic mt-1">{errors.age}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone1">
                            전화번호
                        </label>
                        <div className="flex">
                            <input
                                id="phone1"
                                type="text"
                                name="phone1"
                                value={user.phone1}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                maxLength="3"
                            />
                            <input
                                id="phone2"
                                type="text"
                                name="phone2"
                                value={user.phone2}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                maxLength="4"
                            />
                            <input
                                id="phone3"
                                type="text"
                                name="phone3"
                                value={user.phone3}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                maxLength="4"
                            />
                        </div>
                        {errors.phone1 && <p className="text-red-500 text-xs italic mt-1">{errors.phone1}</p>}
                        {(errors.phone2 || errors.phone3) &&
                            <p className="text-red-500 text-xs italic mt-1">전화번호를 모두 입력해주세요.</p>}
                    </div>
                </div>

                <div className="flex items-center justify-center mt-6">
                    <button type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto">
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MemberModifyComponent;