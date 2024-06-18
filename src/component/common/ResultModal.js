import {useEffect} from "react";

const ResultModal = ({title, content, callbackFn}) => {

    useEffect(() => {
        document.getElementById('my_modal_1').showModal();
    }, []);

    return (

            <dialog id="my_modal_1" className="modal" onClick={() => {
                if (callbackFn) {
                    callbackFn()
                }
            }}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="py-4">{content}</p>
                    <div className="modal-action">
                        <form method="dialog" onClick={() => {
                            if (callbackFn) {
                                callbackFn()
                            }
                        }}>
                            <button type="submit" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
                            </button>
                            <button type="submit" className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
    );
};

export default ResultModal;
