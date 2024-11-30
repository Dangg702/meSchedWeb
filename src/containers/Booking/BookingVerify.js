import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '~/store/actions';
import { userService } from '~/services';

class BookingVerify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVerify: false,
            errCode: 0,
        };
    }

    async componentDidMount() {
        let { location } = this.props;
        let cookieVal = this.getCookie('verifyData');

        if (location && location.search) {
            const searchParams = new URLSearchParams(location.search);
            let token = searchParams.get('token');
            let date = searchParams.get('date');
            let rs = await userService.verifyBooking({
                token: token,
                date: date,
                dataVerify: JSON.parse(cookieVal),
            });
            if (rs?.errCode === 0) {
                this.setState({
                    isVerify: true,
                    errCode: rs.errCode,
                });
            } else {
                this.setState({
                    isVerify: true,
                    errCode: rs.errCode,
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {}

    componentWillUnmount() {
        // this.debouncedOnChange.cancel();
    }

    getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    render() {
        let { isVerify, errCode } = this.state;
        return (
            <>
                <div className="verify-booking-container">
                    {isVerify ? (
                        <div>
                            {+errCode === 0 ? (
                                <h1
                                    style={{ color: 'red', textAlign: 'center', textTransform: 'uppercase' }}
                                    className="p-5"
                                >
                                    Xác nhận thành công
                                </h1>
                            ) : (
                                <h1
                                    style={{ color: 'red', textAlign: 'center', textTransform: 'uppercase' }}
                                    className="p-5"
                                >
                                    Lịch hẹn đã được xác nhận hoặc đã hết hạn
                                </h1>
                            )}
                        </div>
                    ) : (
                        <div>Vui lòng chờ xác nhận</div>
                    )}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        scheduleTime: state.admin.scheduleTime,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchScheduleCode: () => dispatch(actions.fetchScheduleCode()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingVerify);
