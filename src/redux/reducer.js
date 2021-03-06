import {
    combineReducers
} from 'redux';
import {
    SET_HEADER_TITLE,
    RECEICE_USER,
    SHOW_ERROR_MSG,
    RESET_USER,
    SET_PRODUCT
} from './actionTypes'
import storageUtils from '../utils/storageUtils';

const initHeadTitle = ''

function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEADER_TITLE:
            return action.data
        default:
            return state;
    }
}

const initUser = storageUtils.getUser();

function user(state = initUser, action) {
    switch (action.type) {
        case RECEICE_USER:
            storageUtils.saveUser(action.user)
            return action.user
        case RESET_USER:
            storageUtils.removeUser();
            return {}
            default:
                return state;
    }
}

const initErrorMsg = ''

function errorMsg(state = initErrorMsg, action) {
    switch (action.type) {
        case SHOW_ERROR_MSG:
            return action.errorMsg
        default:
            return state
    }
}

function product(state = {}, action) {
    switch (action.type) {
        case SET_PRODUCT:
            return action.product
        default:
            return state
    }
}

export default combineReducers({
    headTitle,
    user,
    errorMsg,
    product
})