import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { languages } from '~/utils';
import './DoctorIntro.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class DoctorIntro extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    render() {
        const { language, doctorData, fontSize, fontColor, positionSize, buttonRight, btnStyle } = this.props;
        let clinicName = doctorData?.doctorInfoData?.clinicData.name;
        let specialtyValueVi = '',
            specialtyValueEn = '',
            doctorNameVi = '',
            doctorNameEn = '',
            addressClinic = '',
            image = doctorImg;

        if (doctorData) {
            image = doctorData?.image ? doctorData.image : doctorData['doctorInfoData.image'];
            addressClinic = doctorData?.addressClinic && doctorData.addressClinic;
            specialtyValueVi =
                doctorData?.doctorInfoData && doctorData.doctorInfoData
                    ? `Chuyên khoa: ${doctorData?.doctorInfoData?.specialtyData.valueVi}`
                    : `Chuyên khoa: ${doctorData['specialtyData.valueVi']}`;
            specialtyValueEn =
                doctorData?.doctorInfoData && doctorData.doctorInfoData
                    ? `Specialty: ${doctorData?.doctorInfoData?.specialtyData.valueEn}`
                    : `Specialty: ${doctorData['specialtyData.valueEn']}`;
            doctorNameVi =
                doctorData?.lastName && doctorData?.lastName
                    ? `${doctorData?.lastName} ${doctorData?.firstName}`
                    : `${doctorData['doctorInfoData.lastName']} ${doctorData['doctorInfoData.firstName']}`;
            doctorNameEn =
                doctorData?.lastName && doctorData?.lastName
                    ? `${doctorData?.firstName} ${doctorData?.lastName} `
                    : `${doctorData['doctorInfoData.firstName']} ${doctorData['doctorInfoData.lastName']}`;
        }

        return (
            <>
                <div className="row g-0 doctor-info-content px-3">
                    <div className="col-sm-12 col-md-2">
                        <div className="image-container">
                            <img className={`${this.props.className} image rounded-circle`} src={image} alt="avatar" />
                        </div>
                    </div>
                    {buttonRight ? (
                        <>
                            <div className="col-sm-12 col-md-7 m-auto">
                                <div className="doctor-position" style={{ fontSize: positionSize }}>
                                    {language === languages.VI ? doctorNameVi : doctorNameEn}
                                </div>
                                <div className="doctor-info" style={{ fontSize: fontSize, fontColor: fontColor }}>
                                    {addressClinic ? (
                                        addressClinic
                                    ) : (
                                        <span>{language === languages.VI ? specialtyValueVi : specialtyValueEn}</span>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 m-auto">
                                <div className="button-right">
                                    <button className={`${btnStyle}`}>
                                        <FormattedMessage id="booking.quick-booking" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-sm-12 col-md-8 m-auto">
                                <div className="doctor-position" style={{ fontSize: positionSize }}>
                                    {language === languages.VI
                                        ? doctorData?.positionData
                                            ? `${doctorData?.positionData?.valueVi} ${doctorData?.lastName} ${doctorData?.firstName}`
                                            : `${doctorData?.lastName} ${doctorData?.firstName}`
                                        : doctorData?.positionData
                                        ? `${doctorData?.positionData?.valueEn} ${doctorData?.firstName} ${doctorData?.lastName}`
                                        : `${doctorData?.firstName} ${doctorData?.lastName}`}
                                </div>
                                <div className="doctor-info" style={{ fontSize: fontSize, fontColor: fontColor }}>
                                    {addressClinic
                                        ? addressClinic
                                        : doctorData?.doctorInfoData?.specialtyData.valueVi &&
                                          doctorData?.doctorInfoData?.clinicData.name && (
                                              <span>
                                                  {language === languages.VI ? specialtyValueVi : specialtyValueEn}
                                                  <br />
                                                  {language === languages.VI
                                                      ? `Nơi công tác: ${clinicName}`
                                                      : `Work place: ${clinicName}`}
                                              </span>
                                          )}
                                </div>
                            </div>
                        </>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorIntro);
