import React, {useEffect, useState} from 'react';
import ResultModal from "../common/ResultModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import {modifyMember} from "../../api/memberApi";

const initState = {
    email:'',
    pw:'',
    nickname:''
}

function MemberModifyComponent() {


    const [user, setUser] = useState(initState)
    const {loginState,moveToLogin} = useCustomLogin();
    const [result, setResult] = useState('')


    useEffect(() => {
        setUser({...loginState, pw:'TEMP'})
    }, [loginState]);

    const handleChange =(e)=>{
        user[e.target.name] =e.target.value
        setUser({...user})
    }

    const handleClickModify=(e)=>{
        e.preventDefault();

        modifyMember(user).then(

            ()=>  setResult("Modified")
        )
    }

    const closeModal=()=>{
        setResult(null);
        moveToLogin()
    }


    return (
        <div>
            {result ? <ResultModal title={'회원정보 수정'} content={` ${user.email} 번 게시물 수정이 완료 되었습니다.`}
                                   callbackFn={closeModal}/> : <></>}
            <form onSubmit={handleClickModify} className="space-y-4">
                <h1 className="text-3xl font-bold mb-4">회원정보 수정</h1>
                <div className="form-control">
                    <label htmlFor="title" className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="email"
                        value={user.email}
                        readOnly
                        required
                        className="input input-bordered"
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="content" className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        id="content"
                        name="pw"
                        type={"password"}
                        value={user.pw}
                        onChange={handleChange}
                        required
                        className="textarea textarea-bordered"
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="content" className="label">
                        <span className="label-text">Nickname</span>
                    </label>
                    <input
                        id="content"
                        name="nickname"
                        type={"text"}
                        value={user.nickname}
                        onChange={handleChange}
                        required
                        className="textarea textarea-bordered"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Modify</button>
            </form>
        </div>
    );
}

export default MemberModifyComponent;