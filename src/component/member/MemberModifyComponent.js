import React, { useEffect, useState } from 'react';
import ResultModal from "../common/ResultModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import { getMember, modifyMember } from "../../api/memberAPI";
import { UserCircleIcon } from "@heroicons/react/20/solid";

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
    const { loginState, moveToLogin } = useCustomLogin();
    const [result, setResult] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchMemberData = async () => {
            if (loginState) {
                try {
                    const memberData = await getMember();
                    const [phone1, phone2, phone3] = memberData.mobile ? memberData.mobile.split('-') : ['', '', ''];
                    setUser({
                        ...initState,
                        ...memberData,
                        phone1,
                        phone2,
                        phone3,
                    });
                } catch (error) {
                    console.error("회원 데이터 가져오기 오류:", error);
                    setResult("오류");
                }
            }
        };
        fetchMemberData()
    }, [loginState]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        if (name === 'nickname') {
            validateNickname(value);
        }
    };

    const validateNickname = (nickname) => {
        if (/[!@#$%^&*(),.?":{}|<>]/.test(nickname)) {
            setErrors(prev => ({ ...prev, nickname: '특수문자는 사용할 수 없습니다.' }));
        } else {
            setErrors(prev => ({ ...prev, nickname: '' }));
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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClickModify = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const updatedUser = {

                    email: user.email,
                    nickname: user.nickname,
                    gender:user.gender,
                    age: user.age,
                    mobile: `${user.phone1}-${user.phone2}-${user.phone3}`,

                };
                delete updatedUser.phone1;
                delete updatedUser.phone2;
                delete updatedUser.phone3;

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
        moveToLogin();
    };

    return (
        <div className="container mx-auto p-4">
            {result && (
                <ResultModal
                    title={'회원정보 수정'}
                    content={result === "Modified"
                        ? `${user.email} 님의 회원정보가 수정되었습니다.`
                        : "회원정보 수정 중 오류가 발생했습니다."}
                    callbackFn={closeModal}
                />
            )}
            <form onSubmit={handleClickModify} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h1 className="text-3xl font-bold mb-6 text-center">회원정보 수정</h1>

                <div className="flex justify-center mb-6">
                    {user.img ? (
                        <img
                            src={user.img}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                        />
                    ) : (
                        <UserCircleIcon className="w-32 h-32 text-blue-500" />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <input
                            id="nickname"
                            type="text"
                            name="nickname"
                            value={user.nickname}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.nickname && <p className="text-red-500 text-xs italic">{errors.nickname}</p>}
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
                        {errors.gender && <p className="text-red-500 text-xs italic">{errors.gender}</p>}
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
                        {errors.age && <p className="text-red-500 text-xs italic">{errors.age}</p>}
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
                        {(errors.phone1 || errors.phone2 || errors.phone3) && <p className="text-red-500 text-xs italic">전화번호를 모두 입력해주세요.</p>}
                    </div>
                </div>

                <div className="flex items-center justify-center mt-6">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MemberModifyComponent;