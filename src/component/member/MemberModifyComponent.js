import React, { useEffect, useState } from 'react';
import ResultModal from "../common/ResultModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import { modifyMember } from "../../api/memberAPI";

const initState = {
    id: '',
    email: '',
    pw: '',
    name: '',
    nickname: '',
    social: false,
    gender: '',
    age: '',
    mobile: '',
    img: '',
};

function MemberModifyComponent() {
    const [user, setUser] = useState(initState);
    const { loginState, moveToLogin } = useCustomLogin();
    const [result, setResult] = useState('');

    useEffect(() => {
        if (loginState) {
            setUser({ ...loginState, pw: 'TEMP' });
        }
    }, [loginState]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleClickModify = async (e) => {
        e.preventDefault();
        try {
            await modifyMember(user);
            setResult("Modified");
        } catch (error) {
            console.error("Error modifying user:", error);
            setResult("Error");
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
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                        연령대
                    </label>
                    <input
                        id="age"
                        type="text"
                        name="age"
                        value={user.age}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobile">
                        전화번호
                    </label>
                    <input
                        id="mobile"
                        type="tel"
                        name="mobile"
                        value={user.mobile}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MemberModifyComponent;