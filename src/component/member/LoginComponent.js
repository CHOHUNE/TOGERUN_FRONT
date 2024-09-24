import React, {useState} from 'react';
import useCustomLogin from "../../hooks/useCustomLogin";

const initState = {
    email: '',
    pw: ''
}

const LoginComponent = () => {

    const [loginParam, setLoginParam] = useState({...initState})



    const {doLogin,moveToPath} = useCustomLogin();
    // const dispatch = useDispatch();

    const handleChange = (e) => {
        loginParam[e.target.name] = e.target.value
        setLoginParam({...loginParam})
    }

    const handleClickLogin = (e) => {
        e.preventDefault();
        doLogin(loginParam).then(response => {
            if (!response.error) {
                moveToPath('/')

            }
        })

    }

    return (
        <div className="card shrink-0 w-full max-w-2xl shadow-2xl bg-base-100">
            <form className="card-body">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input name={"email"} type="text" value={loginParam.email} onChange={handleChange}
                           placeholder="email" className="input input-bordered" required/>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input name={"pw"} type="password" value={loginParam.pw} onChange={handleChange}
                           placeholder="password" className="input input-bordered" required/>
                </div>
                <div className="flex justify-end my-4 ">
                    <a href="#" className="label-text-alt link link-hover mr-4">회원가입</a>
                    <a href="#" className="label-text-alt link link-hover">비밀번호 찾기</a>
                </div>
                <div className="form-control">
                    <button className="btn btn-primary" onClick={handleClickLogin}>로그인</button>
                </div>

                <div className="form-control mt-3">
                    <a
                        href="http://localhost:8080/oauth2/authorization/kakao"
                        className="btn flex items-center justify-center bg-[#FEE500] hover:bg-[#FEE500] text-[#000000] border-none font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 191.94" className="h-6 w-6 mr-2">
                            <g>
                                <polygon className="fill-current"
                                         points="76.01 89.49 87.99 89.49 87.99 89.49 82 72.47 76.01 89.49"/>
                                <path className="fill-current"
                                      d="M104,0C46.56,0,0,36.71,0,82c0,29.28,19.47,55,48.75,69.48-1.59,5.49-10.24,35.34-10.58,37.69,0,0-.21,1.76.93,2.43a3.14,3.14,0,0,0,2.48.15c3.28-.46,38-24.81,44-29A131.56,131.56,0,0,0,104,164c57.44,0,104-36.71,104-82S161.44,0,104,0ZM52.53,69.27c-.13,11.6.1,23.8-.09,35.22-.06,3.65-2.16,4.74-5,5.78a1.88,1.88,0,0,1-1,.07c-3.25-.64-5.84-1.8-5.92-5.84-.23-11.41.07-23.63-.09-35.23-2.75-.11-6.67.11-9.22,0-3.54-.23-6-2.48-5.85-5.83s1.94-5.76,5.91-5.82c9.38-.14,21-.14,30.38,0,4,.06,5.78,2.48,5.9,5.82s-2.3,5.6-5.83,5.83C59.2,69.38,55.29,69.16,52.53,69.27Zm50.4,40.45a9.24,9.24,0,0,1-3.82.83c-2.5,0-4.41-1-5-2.65l-3-7.78H72.85l-3,7.78c-.58,1.63-2.49,2.65-5,2.65a9.16,9.16,0,0,1-3.81-.83c-1.66-.76-3.25-2.86-1.43-8.52L74,63.42a9,9,0,0,1,8-5.92,9.07,9.07,0,0,1,8,5.93l14.34,37.76C106.17,106.86,104.58,109,102.93,109.72Zm30.32,0H114a5.64,5.64,0,0,1-5.75-5.5V63.5a6.13,6.13,0,0,1,12.25,0V98.75h12.75a5.51,5.51,0,1,1,0,11Zm47-4.52A6,6,0,0,1,169.49,108L155.42,89.37l-2.08,2.08v13.09a6,6,0,0,1-12,0v-41a6,6,0,0,1,12,0V76.4l16.74-16.74a4.64,4.64,0,0,1,3.33-1.34,6.08,6.08,0,0,1,5.9,5.58A4.7,4.7,0,0,1,178,67.55L164.3,81.22l14.77,19.57A6,6,0,0,1,180.22,105.23Z"/>
                            </g>
                        </svg>
                        카카오 로그인
                    </a>
                </div>


                <div className="form-control mt-3">
                    <a href="http://localhost:8080/oauth2/authorization/naver"
                       className="btn btn-outline hover:bg-[#03C75A] hover:border-[#03C75A] text-[#03C75A] hover:text-white">
                        NAVER 로그인
                    </a>
                </div>


                <div className="form-control mt-3">
                    <a href="http://localhost:8080/oauth2/authorization/google"
                       className="btn btn-outline hover:bg-[#4285F4] hover:border-[#4285F4] text-[#4285F4] hover:text-white">
                        <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            <path d="M1 1h22v22H1z" fill="none"/>
                        </svg>
                        Google 로그인
                    </a>
                </div>


            </form>

        </div>
    );
};

export default LoginComponent;