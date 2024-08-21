import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";

const getNum = (param, defaultValue) => {

    if (!param) {
        return defaultValue;

    }
    return parseInt(param);

}


const useCustomMove = () => {

    const navigate = useNavigate();
    const [queryParams] = useSearchParams();

    const page = getNum(queryParams.get("page"), 1);
    const size = getNum(queryParams.get("size"), 10)
    const keyword = queryParams.get("keyword") || "";

    const queryDefault = createSearchParams({page, size,keyword}).toString();
    const [refresh, setRefresh] = useState(false)

    const moveToList = (pageParam) => {
        let queryStr = ""

        if (pageParam) {

            const pageNum = getNum(pageParam.page, 1)
            const sizeNum = getNum(pageParam.size, 10)
            const keywordStr= pageParam.keyword  !== undefined? pageParam.keyword : keyword

            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                keyword: keywordStr

            }).toString()

        } else {
            queryStr = queryDefault
        }
        setRefresh(!refresh)
        navigate({pathname: '../list', search: queryStr})
    }


    const moveToModify = (id) => {
        navigate({pathname: `../modify/${id}`, search: queryDefault})
    }

    const moveToRead = (num) => {

        navigate({
            pathname: `../${num}`,
            search: queryDefault
        })
    }

    return {moveToList, moveToModify, page, size, refresh, moveToRead ,keyword}

}

export default useCustomMove;