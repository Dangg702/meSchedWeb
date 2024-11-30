import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { NumericFormat } from 'react-number-format';

import './DoctorExtraInfo.scss';
import { languages } from '~/utils';

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { language } = this.props;
        const { doctorExtraData } = this.props;

        return (
            <div className="doctor-extra-info-container">
                <div className="ps-3 pt-3">
                    <div className="info-title">
                        <FormattedMessage id="doctor.address-title" />
                    </div>
                    <div className="clinic-name">{doctorExtraData?.clinicData.name}</div>
                    <div className="address-detail ">{doctorExtraData?.clinicData.address}</div>
                </div>
                <div className="break-line"></div>
                <div className="d-flex align-items-center pt-3 ps-3">
                    <div className="info-title">
                        <FormattedMessage id="doctor.price-title" />:
                    </div>
                    <div className="ms-2">
                        {doctorExtraData && doctorExtraData.priceData && language === languages.VI ? (
                            <NumericFormat
                                displayType="text"
                                value={doctorExtraData?.priceData?.valueVi}
                                thousandSeparator=","
                                suffix={'VND'}
                            />
                        ) : (
                            <NumericFormat
                                displayType="text"
                                value={doctorExtraData?.priceData?.valueEn}
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
