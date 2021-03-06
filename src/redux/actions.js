import {
    SET_HEADER_TITLE,
    RECEICE_USER,
    SHOW_ERROR_MSG,
    RESET_USER,
    SET_PRODUCT
} from './actionTypes';
import {
    reqLogin
} from '../api'

export const setHeaderTitle = (headerTitle) => ({
    type: SET_HEADER_TITLE,
    data: headerTitle
})

export const receiveUser = (user) => ({
    type: RECEICE_USER,
    user
})

export const showErrorMsg = errorMsg => ({
    type: SHOW_ERROR_MSG,
    errorMsg
})

export const logout = () => ({
    type: RESET_USER
})

export const login = (username, password) => {
    return async dispatch => {
        const loginRes = await reqLogin(username, password);
        if (loginRes.status === 0) {
            const user = loginRes.data;
            dispatch(receiveUser(user))
            dispatch(showErrorMsg(''))
        } else {
            const errMsg = loginRes.msg;
            dispatch(showErrorMsg(errMsg))
        }
    }
}

export const setProduct = (product) => ({
    type: SET_PRODUCT,
    product
})