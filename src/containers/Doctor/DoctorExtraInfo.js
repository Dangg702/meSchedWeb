import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { NumericFormat } from 'react-number-format';

import DoctorSchedule from './DoctorSchedule';
import { path, languages } from '~/utils';
import doctorService from '~/services/doctorService';
import { userService } from '~/services';
import './DoctorExtraInfo.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorInfoData: {},
        };
    }

    async componentDidMount() {
        let { doctorId } = this.props;
        let data = await userService.getExtraInfoDoctor(doctorId);
        if (data && data.errCode === 0) {
            this.setState({ doctorInfoData: data.data });
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        let { doctorId } = this.props;
        if (this.props.language !== prevProps.language) {
        }
        if (doctorId !== prevProps.doctorId) {
            let data = await userService.getExtraInfoDoctor(doctorId);
            if (data && data.errCode === 0) {
                this.setState({ doctorInfoData: data.data });
            }
        }
    }

    render() {
        let { language } = this.props;
        let { doctorInfoData } = this.state;

        return (
            <div className="doctor-extra-info-container">
                <div className="ps-3 pt-3">
                    <div className="info-title">
                        <FormattedMessage id="doctor.address-title" />
                    </div>
                    <div className="clinic-name">{doctorInfoData?.nameClinic}</div>
                    <div className="address-detail ">{doctorInfoData?.addressClinic}</div>
                </div>
                <div className="break-line"></div>
                <div className="d-flex align-items-center pt-3 ps-3">
                    <div className="info-title">
                        <FormattedMessage id="doctor.price-title" />:
                    </div>
                    <div className="ms-2">
                        {doctorInfoData && doctorInfoData.priceData && language === languages.VI ? (
                            <NumericFormat
                                displayType="text"
                                value={doctorInfoData?.priceData?.valueVi}
                                thousandSeparator=","
                                suffix={'VND'}
                            />
                        ) : (
                            <NumericFormat
                                displayType="text"
                                value={doctorInfoData?.priceData?.valueEn}
                                thousandSeparator=","
                                suffix={'USD'}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);
