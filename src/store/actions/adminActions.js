import actionTypes from './actionTypes';
import userService from '../../services/userService';

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START });
            let res = await userService.getAllCodeService('GENDER');
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderStart error', error);
        }
    };
};

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
});

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
});

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_START });
            let res = await userService.getAllCodeService('POSITION');
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            dispatch(fetchPositionFailed());
            console.log('fetchGenderStart error', error);
        }
    };
};

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
});

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
});

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START });
            let res = await userService.getAllCodeService('ROLE');
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            dispatch(fetchRoleFailed());
            console.log('fetchGenderStart error', error);
        }
    };
};

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
});

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
});

export const fetchScheduleCode = (type) => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllCodeService('TIME');
            if (res && res.errCode === 0) {
                dispatch({ type: actionTypes.FETCH_SCHEDULE_CODE_SUCCESS, timeData: res.data });
            } else {
                dispatch(fetchScheduleCodeFailed());
            }
        } catch (error) {
            dispatch(fetchScheduleCodeFailed());
            console.log('fetchScheduleCodeFailed error', error);
        }
    };
};
export const fetchScheduleCodeFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
});

export const fetchCodeForDoctorInfo = () => {
    return async (dispatch, getState) => {
        try {
            let resPrice = await userService.getAllCodeService('PRICE');
            let resPayment = await userService.getAllCodeService('PAYMENT');
            let resProvince = await userService.getAllCodeService('PROVINCE');

            if (
                resPrice &&
                resPrice.errCode === 0 &&
                resPayment &&
                resPayment.errCode === 0 &&
                resProvince &&
                resProvince.errCode === 0
            ) {
                let res = { priceData: resPrice.data, paymentData: resPayment.data, cityData: resProvince.data };
                dispatch({ type: actionTypes.FETCH_CODE_FOR_DOCTOR_INFO_SUCCESS, data: res });
            } else {
                dispatch(fetchCodeForDoctorInfoFailed());
            }
        } catch (error) {
            dispatch(fetchCodeForDoctorInfoFailed());
            console.log('fetchCodeForDoctorInfoFailed error', error);
        }
    };
};
export const fetchCodeForDoctorInfoFailed = () => ({
    type: actionTypes.FETCH_CODE_FOR_DOCTOR_INFO_FAILED,
});
