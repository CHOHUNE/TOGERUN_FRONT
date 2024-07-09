import ReactDOM from "react-dom/client";
import App from "./App.js";
import './input.css'
import {RecoilRoot} from "recoil";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <RecoilRoot>
        <App/>
        </RecoilRoot>

);


