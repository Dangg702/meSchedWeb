import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { NumericFormat } from 'react-number-format';
import _ from 'lodash';
import FormikForm from '~/components/Form/FormikForm';

import DoctorIntro from '~/components/DoctorIntro';
import { path, languages } from '~/utils';
import * as actions from '~/store/actions';
import { userService } from '~/services';
// import './BookingVerify.scss';
import { toast } from 'react-toastify';

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
        if (location && location.search) {
            const searchParams = new URLSearchParams(location.search);
            let token = searchParams.get('token');
            let date = searchParams.get('date');
            let rs = await userService.verifyBooking({
                token: token,
                date: date,
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
        this.debouncedOnChange.cancel();
    }

    render() {
        let { language } = this.props;
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
