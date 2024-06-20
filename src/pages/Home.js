import React from 'react';
import LoginComponent from "../component/post/LoginComponent";

function Home(props) {
    return (

        <div className="hero min-h-screen bg-gradient-to-b from-white to-gray-500">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
                        exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <LoginComponent/>
            </div>
        </div>
    );
}

export default Home;