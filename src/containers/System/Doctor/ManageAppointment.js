import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import './ManageAppointment.scss';
import { languages } from '~/utils';
import { DatePicker } from '~/components/Input';
import * as actions from '~/store/actions';
import { toast } from 'react-toastify';
import { Table } from 'reactstrap';
import { userService } from '~/services';

class ManageAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            listAppointment: [],
            errs: {
                selectedDate: null,
            },
        };
    }

    async componentDidMount() {
        this.getListAppointmentPatient();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedDate !== this.state.selectedDate) {
            this.getListAppointmentPatient();
        }
    }

    getListAppointmentPatient = async () => {
        let doctorId = this.props.user.id;
        let { selectedDate } = this.state;
        let date = moment(selectedDate).format('DD/MM/YYYY');
        let result = await userService.getListAppointmentPatient(doctorId, date);
        if (result && result.errCode === 0) {
            this.setState({ listAppointment: result.data });
        }
    };

    handleChangeDate = (date) => {
        this.setState({ selectedDate: date[0], errs: { selectedDate: null } });
    };

    handleConfirm = async (data) => {
        let dt = {
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            timeType: data.time,
        };
        this.props.setLoading(true);
        let res = await userService.confirmAppointment(dt);
        if (res.errCode === 0) {
            this.props.setLoading(false);
            toast.success('Xác nhận thành công');
            this.getListAppointmentPatient();
        } else {
            toast.error('Xác nhận thất bại');
        }
    };

    handleCancel = async (data) => {
        let dt = {
            doctorId: data.doctorId,
            patientId: data.patientId,
            date: data.date,
            timeType: data.time,
        };
        this.props.setLoading(true);
        let res = await userService.cancelAppointment(dt);
        if (res.errCode === 0) {
            this.props.setLoading(false);
            toast.success('Hủy thành công');
            this.getListAppointmentPatient();
        } else {
            toast.error('Hủy thất bại');
        }
    };

    render() {
        let { selectedDate, errs, listAppointment } = this.state;
        let { language } = this.props;
        return (
            <div className="container appointment-container">
                <div className="appointment-title my-3">
                    <FormattedMessage id="manage-appointment.title" />
                </div>
                <div className="manage-appointment-body-wrapper">
                    <div className="col-sm-12 col-md-4 form-group">
                        <label>
                            <FormattedMessage id="manage-appointment.choose-date" />
                        </label>
                        <DatePicker onChange={this.handleChangeDate} className="form-control" value={selectedDate} />
                        <div className={errs || errs.selectedDate ? 'error-message' : ''}>{errs.selectedDate}</div>
                    </div>
                    <div className="col-12 mt-3 table-manage-patient">
                        <Table bordered responsive>
                            <thead>
                                <tr className="table-warning">
                                    <th>#</th>
                                    <th>
                                        <FormattedMessage id="manage-appointment.status" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="manage-appointment.time" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="manage-appointment.patient-name" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="manage-appointment.gender" />
                                    </th>
                                    <th>Email</th>
                                    <th>
                                        <FormattedMessage id="manage-appointment.actions" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listAppointment && listAppointment.length > 0 ? (
                                    listAppointment.map((item, index) => (
                                        <tr>
                                            <th scope="row" key={index}>
                                                {index + 1}
                                            </th>
                                            <td>
                                                {language === languages.VI
                                                    ? item.statusData.valueVi
                                                    : item.statusData.valueEn}
                                            </td>
                                            <td>
                                                {language === languages.VI
                                                    ? item.timeBookingData.valueVi
                                                    : item.timeBookingData.valueEn}
                                            </td>
                                            <td>
                                                {item.patientData.lastName} {item.patientData.firstName}
                                            </td>
                                            <td>
                                                {language === languages.VI
                                                    ? item.patientData.genderData.valueVi
                                                    : item.patientData.genderData.valueEn}
                                            </td>
                                            <td>{item.patientData.email}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => this.handleConfirm(item)}
                                                >
                                                    <FormattedMessage id="manage-appointment.confirm" />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger ms-2"
                                                    onClick={() => this.handleCancel(item)}
                                                >
                                                    <FormattedMessage id="manage-appointment.cancel" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            <FormattedMessage id="manage-appointment.no-data" />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        scheduleTime: state.admin.scheduleTime,
        user: state.user.userInfo,
        loading: state.app.loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAppointment);
