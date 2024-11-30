import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { NumericFormat } from 'react-number-format';
import _ from 'lodash';

import DoctorIntro from '~/components/DoctorIntro';
import { languages } from '~/utils';
import * as actions from '~/store/actions';
import { paymentService, userService } from '~/services';
import './Booking.scss';
import { toast } from 'react-toastify';
import { PayPalButton } from 'react-paypal-button-v2';

class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorId: -1,
            date: '',
            time: '',
            doctorInfo: null,
            priceData: null,
            sdkReady: false,
            checkAppointment: false,
        };
        this.debouncedOnChange = _.debounce(this.handleChangeInput, 400);
    }

    async componentDidMount() {
        this.props.fetchScheduleCode();
        const { match, location } = this.props;
        const searchParams = new URLSearchParams(location.search);
        let dateSearch = searchParams.get('date');
        let timeSearch = searchParams.get('time');
        // let doctorId =  match?.params?.id;

        if (match?.params?.id && dateSearch && timeSearch) {
            try {
                const doctorInfo = await userService.getProfileDoctor(match.params.id);
                const data = doctorInfo.data;
                this.setState({
                    doctorId: match.params.id,
                    date: dateSearch,
                    time: timeSearch,
                    doctorInfo: {
                        positionData: data.positionData,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        image: data.image,
                        addressClinic: data.doctorInfoData.clinicData.address,
                    },
                    priceData: data.doctorInfoData.priceData,
                });
            } catch (error) {
                console.error('Không thể lấy thông tin bác sĩ.', error);
            }
        } else {
            console.error('Thiếu thông tin cần thiết từ query string hoặc match.');
        }

        await this.getConfig();
        await this.checkAppointment(match.params.id, dateSearch);
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
        let dataVerify = {
            date: date,
            doctorId: doctorId,
            timeType: {
                type: time,
                value: timeVal,
            },
        };
        try {
            this.props.setLoading(true);
            let result = await userService.bookingAppointment(data);
            if (result.errCode === 0) {
                this.props.setLoading(false);
                toast.success('Hãy kiểm tra hộp thư');
                document.cookie = `verifyData=${JSON.stringify(dataVerify)}; path=/`;
                this.props.history.goBack();
            } else {
                this.props.setLoading(false);
                toast.error('Đặt lịch thất bại: ' + result.message);
            }
        } catch (error) {
            console.error('handleBooking error: ', error);
        }
    };

    getConfig = async () => {
        try {
            const response = await paymentService.getConfig();
            if (response.errCode === 0) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://sandbox.paypal.com/sdk/js?client-id=${response.data}`;
                script.async = true;
                script.onload = () => {
                    this.setState({ sdkReady: true });
                };
                document.body.appendChild(script);
            } else {
                console.error('getConfig error: ', response.data.message);
            }
        } catch (error) {
            console.error('getConfig error: ', error);
        }
    };

    handleBookAppointment = async (paymentData) => {
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
            paymentData,
        };
        try {
            this.props.setLoading(true);
            let result = await userService.bookingAppointment(data);
            if (result.errCode === 0) {
                this.props.setLoading(false);
                toast.success('Đặt lịch thành công');
                this.props.history.goBack();
            } else {
                this.props.setLoading(false);
                toast.error('Đặt lịch thất bại: ' + result.message);
            }
        } catch (error) {
            console.error('handleBooking error: ', error);
        }
    };

    onSuccessPaypal = (details, data) => {
        const paymentData = {
            invoiceId: details.id,
            captureId: details.purchase_units[0].payments.captures[0].id,
            amount: String(details.purchase_units[0].amount.value * 25000),
            paymentMethod: 'paypal',
            paymentStatus: 'paid',
        };
        console.log('paymentData', paymentData);
        this.handleBookAppointment(paymentData);
    };

    checkAppointment = async (doctorId, date) => {
        let data = {
            patientId: this.props.userInfo.id,
            doctorId,
            date,
        };
        const response = await userService.checkAppointment(data);
        if (response.errCode !== 0) {
            this.setState({ checkAppointment: true });
        } else {
            this.setState({ checkAppointment: false });
        }
    };

    render() {
        let { language, scheduleTime } = this.props;
        let { doctorInfo, time, priceData } = this.state;
        const foundTime = scheduleTime?.find((item) => item.keyMap === time);
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
                        <div className="col-sm-12 col-lg-4 content-wrapper p-3">
                            <div className="booking-title">
                                <FormattedMessage id="booking.info-booking" />
                            </div>
                            <div className="separate-line"></div>
                            <DoctorIntro
                                doctorData={doctorInfo}
                                // addressClinic={doctorInfo}
                                className={'doctor-avatar-booking'}
                                fontSize={'0.8rem'}
                                fontColor={'#595959'}
                                positionSize={'1rem'}
                            />

                            <div className="separate-line"></div>
                            <div className="booking-detail">
                                <Row className="h-30">
                                    <Col>
                                        <FormattedMessage id="booking.date" />
                                    </Col>
                                    <Col className="text-end">{this.state.date}</Col>
                                </Row>
                                <Row className="h-30">
                                    <Col>
                                        <FormattedMessage id="booking.time" />
                                    </Col>
                                    <Col className="text-end">
                                        {language === languages.VI ? foundTime?.valueVi : foundTime?.valueEn}
                                    </Col>
                                </Row>
                                <Row className="h-30">
                                    <Col>
                                        <FormattedMessage id="booking.price" />
                                    </Col>
                                    <Col className="text-end">
                                        {priceData &&
                                            (language === languages.VI ? (
                                                <NumericFormat
                                                    displayType="text"
                                                    value={priceData.valueVi}
                                                    thousandSeparator=","
                                                    suffix={'VND'}
                                                />
                                            ) : (
                                                <NumericFormat
                                                    displayType="text"
                                                    value={priceData.valueEn}
                                                    thousandSeparator=","
                                                    suffix={'USD'}
                                                />
                                            ))}
                                    </Col>
                                </Row>
                                <Row className="h-30">
                                    {/* <Button className="w-100 btn-booking" onClick={this.handleBooking}>
                                        <FormattedMessage id="booking.btn-booking" />
                                    </Button> */}
                                    {!this.state.checkAppointment ? (
                                        <PayPalButton
                                            style={{
                                                height: 38,
                                            }}
                                            amount={Number(priceData?.valueVi) / 25000}
                                            onSuccess={this.onSuccessPaypal}
                                            onError={(err) => {
                                                alert('Thanh toán thất bại');
                                                console.error('Error: ' + err.message);
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <div className="text-center text-danger">
                                                <FormattedMessage id="booking.error-appointment" />
                                            </div>
                                            <Button className="w-100 btn-booking" disabled>
                                                <FormattedMessage id="booking.btn-booking" />
                                            </Button>
                                        </>
                                    )}
                                </Row>
                            </div>
                        </div>
                    </div>
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
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Booking);
