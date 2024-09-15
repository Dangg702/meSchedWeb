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
import './Booking.scss';
import { toast } from 'react-toastify';

class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorId: -1,
            date: '',
            time: '',
            doctorInfo: null,
        };
        this.debouncedOnChange = _.debounce(this.handleChangeInput, 400);
    }

    async componentDidMount() {
        this.props.fetchScheduleCode();
        const { match, location } = this.props;
        const searchParams = new URLSearchParams(location.search);
        let dateSearch = searchParams.get('date');
        let timeSearch = searchParams.get('time');

        if (match?.params?.id && dateSearch && timeSearch) {
            try {
                const doctorInfo = await userService.getProfileDoctor(match.params.id);
                this.setState({
                    doctorId: match.params.id,
                    date: dateSearch,
                    time: timeSearch,
                    doctorInfo: doctorInfo.data,
                });
            } catch (error) {
                console.error('Không thể lấy thông tin bác sĩ.', error);
            }
        } else {
            console.error('Thiếu thông tin cần thiết từ query string hoặc match.');
        }
    }

    componentDidUpdate(prevProps, prevState) {}

    componentWillUnmount() {
        this.debouncedOnChange.cancel();
    }

    handleChangeInput = (event) => {
        // this.setState({ inputValue: event.target.value });
        console.log(event.target);
    };

    formatDoctorName = (doctorInfo) => {
        const { language } = this.props;
        return language === languages.VI
            ? `${doctorInfo.lastName} ${doctorInfo.firstName}`
            : `${doctorInfo.firstName} ${doctorInfo.lastName}`;
    };

    handleBooking = async () => {
        const { language } = this.props;
        const { doctorId, date, time, doctorInfo } = this.state;
        const patientId = this.props.userInfo.id;
        const doctorName = this.formatDoctorName(doctorInfo);
        let timetmp = this.props.scheduleTime?.find((item) => item.keyMap === time);
        let timeVal = language === languages.VI ? timetmp?.valueVi : timetmp?.valueEn;
        let data = {
            patientId,
            doctorId,
            doctorName,
            date,
            timeType: time,
            timeVal,
            language,
        };
        try {
            let result = await userService.bookingAppointment(data);
            if (result.errCode === 0) {
                toast.success('Hãy kiểm tra hộp thư');
                this.props.history.goBack();
            } else {
                toast.error('Đặt lịch thất bại: ' + result.message);
            }
        } catch (error) {
            console.error('handleBooking error: ', error);
        }
    };

    render() {
        let { language, scheduleTime } = this.props;
        let { doctorInfo, time } = this.state;
        const foundTime = scheduleTime?.find((item) => item.keyMap === time);
        console.log('check', doctorInfo);
        return (
            <>
                <div className="booking-container">
                    <div className="row justify-content-md-evenly gy-3 gx-0">
                        <div className="col-sm-12 col-lg-7 content-wrapper">
                            <Form className="p-4">
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="name">
                                                <FormattedMessage id="booking.full-name" />
                                            </Label>
                                            <Input id="name" name="name" onChange={this.debouncedOnChange} />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="phoneNumber">
                                                <FormattedMessage id="booking.phone-number" />
                                            </Label>
                                            <Input id="phoneNumber" name="phoneNumber" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="gender">
                                                <FormattedMessage id="booking.gender" />
                                            </Label>
                                            <Input id="gender" name="gender" />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="email">
                                                <FormattedMessage id="booking.email" />
                                            </Label>
                                            <Input id="email" name="email" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <FormGroup>
                                            <Label for="address">
                                                <FormattedMessage id="booking.address" />
                                            </Label>
                                            <Input id="address" name="address" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label for="reason">
                                                <FormattedMessage id="booking.reason" />
                                            </Label>
                                            <Input id="reason" name="reason" type="textarea" />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="col-sm-12 col-lg-4 content-wrapper p-4">
                            <div className="booking-title">
                                <FormattedMessage id="booking.info-booking" />
                            </div>
                            <div className="separate-line"></div>
                            <DoctorIntro
                                doctorData={doctorInfo}
                                addressClinic={doctorInfo?.doctorInfoData?.addressClinic}
                                className={'doctor-avatar-booking'}
                                fontSize={'0.8rem'}
                                fontColor={'#595959'}
                                positionSize={'1rem'}
                            />

                            <div className="separate-line"></div>
                            <div className="booking-detail">
                                <Row className="h-30">
                                    <Col md={6}>
                                        <FormattedMessage id="booking.date" />
                                    </Col>
                                    <Col md={6} className="text-end">
                                        {this.state.date}
                                    </Col>
                                </Row>
                                <Row className="h-30">
                                    <Col md={6}>
                                        <FormattedMessage id="booking.time" />
                                    </Col>
                                    <Col md={6} className="text-end">
                                        {language === languages.VI ? foundTime?.valueVi : foundTime?.valueEn}
                                    </Col>
                                </Row>
                                <Row className="h-30">
                                    <Col md={6}>
                                        <FormattedMessage id="booking.price" />
                                    </Col>
                                    <Col md={6} className="text-end">
                                        {doctorInfo &&
                                            doctorInfo.doctorInfoData &&
                                            doctorInfo.doctorInfoData.priceData &&
                                            (language === languages.VI ? (
                                                <NumericFormat
                                                    displayType="text"
                                                    value={doctorInfo.doctorInfoData.priceData.valueVi}
                                                    thousandSeparator=","
                                                    suffix={'VND'}
                                                />
                                            ) : (
                                                <NumericFormat
                                                    displayType="text"
                                                    value={doctorInfo.doctorInfoData.priceData.valueEn}
                                                    thousandSeparator=","
                                                    suffix={'USD'}
                                                />
                                            ))}
                                    </Col>
                                </Row>
                                <Row className="h-30">
                                    <Col md={12}>
                                        <Button className="w-100 btn-booking" onClick={this.handleBooking}>
                                            <FormattedMessage id="booking.btn-booking" />
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <HomeFooter /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Booking);
