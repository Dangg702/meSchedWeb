import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoadingGenders: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    scheduleTime: [],
    codeForDoctorInfo: {},
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            state.isLoadingGenders = true;
            return {
                ...state,
            };
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGenders = false;
            return {
                ...state,
            };
        case actionTypes.FETCH_GENDER_FAILED:
            state.isLoadingGenders = false;
            state.genders = [];
            return {
                ...state,
            };
        case actionTypes.FETCH_POSITION_START:
            return {
                ...state,
            };
        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;
            return {
                ...state,
            };
        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = [];
            return {
                ...state,
            };
        case actionTypes.FETCH_ROLE_START:
            return {
                ...state,
            };
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            return {
                ...state,
            };
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            return {
                ...state,
            };
        case actionTypes.FETCH_SCHEDULE_CODE_SUCCESS:
            state.scheduleTime = action.timeData;
            return {
                ...state,
            };
        case actionTypes.FETCH_SCHEDULE_CODE_FAILED:
            state.scheduleTime = [];
            return {
                ...state,
            };
        case actionTypes.FETCH_CODE_FOR_DOCTOR_INFO_SUCCESS:
            state.codeForDoctorInfo = action.data;
            return {
                ...state,
            };
        case actionTypes.FETCH_CODE_FOR_DOCTOR_INFO_FAILED:
            state.codeForDoctorInfo = {};
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default adminReducer;
