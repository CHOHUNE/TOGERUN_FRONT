import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {login} from "../../slice/loginSlice";

const initState = {
    email:'',
    pw:''
}

const LoginComponent = () => {

    const [loginParam, setLoginParam] = useState({...initState})

    const dispatch = useDispatch();

    const handleChange =(e)=>{

        loginParam[e.target.name] = e.target.value
        setLoginParam({...loginParam})
    }

    const handleClickLogin =(e)=>{
        dispatch(login(loginParam))
    }

    return (
        <div className="card shrink-0 w-full max-w-2xl shadow-2xl bg-base-100">
            <form className="card-body">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input name={"email"} type="text" value={loginParam.email} onChange={handleChange} placeholder="email" className="input input-bordered" required/>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input name={"pw"} type="password" value ={loginParam.pw} onChange={handleChange} placeholder="password" className="input input-bordered" required/>
                    <label className="label">
                        {/*<a href="#" className="label-text-alt link link-hover">Forgot password?</a>*/}
                    </label>
                </div>
                <div className="form-control mt-6">
                    <button className="btn btn-primary" onClick={handleClickLogin}>Login</button>
                </div>
            </form>
        </div>
    );
};

export default LoginComponent;