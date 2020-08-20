import {combineReducers} from "redux";

const searchKeyWordReducer = (keyword = '', action) => {
    if (action.type === 'SET_KEYWORD') {
        return action.keyword
    }

    return keyword
}

const openModalFunctionsReducer = (openModalFunctions = new Map(), action) => {
    if (action.type === 'SET_OPEN_MODAL') {
        openModalFunctions.set(action.fileId, action.openModal)
    }

    return openModalFunctions
}

export default combineReducers({
    keyword: searchKeyWordReducer,
    openModalFunctions: openModalFunctionsReducer
})