import ReactDOM from "react-dom/client";
import App from "./App.js";
import {Provider} from "react-redux";
import store from "./store/store";
import './input.css'
import {RecoilRoot} from "recoil";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <RecoilRoot>
        <App/>
        </RecoilRoot>
         </Provider>
);


