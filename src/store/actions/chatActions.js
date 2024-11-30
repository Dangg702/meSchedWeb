import actionTypes from './actionTypes';

export const addMessage = (message) => ({
    type: actionTypes.ADD_MESSAGE,
    payload: message,
});
