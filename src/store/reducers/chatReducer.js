import actionTypes from '../actions/actionTypes';

const initialState = {
    messages: [],
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
       case actionTypes.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        default:
            return state;
    }
};

export default chatReducer;
