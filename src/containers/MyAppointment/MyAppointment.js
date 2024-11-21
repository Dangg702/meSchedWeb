import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';

import { path, languages } from '~/utils';
import userService from '~/services/userService';
import './MyAppointment.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';

class MyAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAppointment: [],
            isConfirmDelModal: false,
        };
    }

    componentDidMount() {
        this.getListAppointment();
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevState.listAppointment !== this.state.listAppointment) {
        //     this.getListAppointment();
        // }
    }

    getListAppointment = async () => {
        let res = await userService.getListAppointmentOfPatientById(this.props.userId);
        if (res && res.errCode === 0) {
            this.setState({ listAppointment: res.data ? res.data : [] });
        }
    };

    toggleModal = () => {
        this.setState({ isConfirmDelModal: !this.state.isConfirmDelModal });
    };

    handleCancelAppointment = async (data) => {
        let dt = {
            bookingId: data.id,
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            timeType: data.timeType,
        };
        // this.props.setLoading(true);
        this.setState({ isConfirmDelModal: false });
        let res = await userService.cancelAppointment(dt);
        if (res.errCode === 0) {
            // this.props.setLoading(false);
            toast.success('Cancel success');
            this.getListAppointment();
        } else {
            toast.error('Cancel failed');
        }
    };

    render() {
        let { language } = this.props;
        let { listAppointment, isConfirmDelModal } = this.state;
        console.log('listAppointment', listAppointment);
        return (
            <>
                <div className="my-appointment-container">
                    <p className="my-appointment__title pb-3 ps-3">
                        <FormattedMessage id="my-appointment.title" />
                    </p>
                    <div className="list-appointment">
                        {listAppointment && listAppointment.length > 0 ? (
                            listAppointment.map((item, index) => (
                                <div className="appointment-item row g-3 pb-3">
                                    <div className="appointment-item__img col-xs-2 col-sm-2 col-md-2">
                                        <img src={item.doctorBookingData.image} alt="doctor" />
                                    </div>
                                    <div className="appointment-item__info col-xs-10 col-sm-10 col-md-8">
                                        <p className="fw-bold">
                                            {language === languages.VI
                                                ? `Bác sĩ ${item.doctorBookingData.lastName} ${item.doctorBookingData.firstName}`
                                                : `Dr. ${item.doctorBookingData.firstName} ${item.doctorBookingData.lastName}`}
                                        </p>
                                        <p className="mb-2">
                                            {language === languages.VI
                                                ? item.doctorBookingData.doctorInfoData.specialtyData.valueVi
                                                : item.doctorBookingData.doctorInfoData.specialtyData.valueEn}
                                        </p>
                                        <p className="fw-bold">
                                            {item.doctorBookingData.doctorInfoData.clinicData.name}
                                        </p>
                                        <p className="mb-2">
                                            {item.doctorBookingData.doctorInfoData.clinicData.address}
                                        </p>
                                        <p>
                                            <strong>
                                                {language === languages.VI ? 'Thời gian: ' : 'Date & Time: '}
                                            </strong>
                                            {item.date},{' '}
                                            {language === languages.VI
                                                ? item.timeBookingData.valueVi
                                                : item.timeBookingData.valueEn}
                                        </p>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-2 appointment-item__btn-wrapper">
                                        {/* <button type="button" className="btn btn-payment">
                                    Thanh toán
                                </button> */}
                                        <button
                                            type="button"
                                            className="btn btn-cancel"
                                            onClick={() => this.toggleModal()}
                                        >
                                            Hủy lịch hẹn
                                        </button>
                                        <Modal isOpen={isConfirmDelModal} toggle={this.toggleModal}>
                                            <ModalHeader toggle={this.toggleModal}>Xác nhận hủy</ModalHeader>
                                            <ModalBody>Bạn có chắc chắn muốn hủy đặt lịch này không?</ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    color="primary"
                                                    onClick={() => this.handleCancelAppointment(item)}
                                                >
                                                    Hủy
                                                </Button>{' '}
                                                <Button color="secondary" onClick={this.toggleModal}>
                                                    Hủy
                                                </Button>
                                            </ModalFooter>
                                        </Modal>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <></>
                        )}
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
        userId: state.user.userInfo.id,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAppointment);
