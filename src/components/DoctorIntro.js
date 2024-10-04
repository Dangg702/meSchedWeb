import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        const { language, doctorData, addressClinic, fontSize, fontColor, positionSize, buttonRight, btnStyle } =
            this.props;
        return (
            <>
                <div className="row doctor-info-content pb-4">
                    <div className="col-sm-12 col-md-2">
                        <div className="image-container">
                            <img
                                className={`${this.props.className} image rounded-circle`}
                                src={doctorImg}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    {buttonRight ? (
                        <>
                            <div className="col-sm-12 col-md-8 m-auto">
                                <div className="doctor-position" style={{ fontSize: positionSize }}>
                                    {language === languages.VI
                                        ? doctorData?.positionData
                                            ? `${doctorData?.positionData?.valueVi} ${doctorData?.lastName} ${doctorData?.firstName}`
                                            : `${doctorData.name}`
                                        : doctorData?.positionData
                                        ? `${doctorData?.positionData?.valueEn} ${doctorData?.firstName} ${doctorData?.lastName}`
                                        : `${doctorData.name}`}
                                </div>
                                <div className="doctor-info" style={{ fontSize: fontSize, fontColor: fontColor }}>
                                    {addressClinic
                                        ? `${addressClinic}`
                                        : doctorData?.markdownData &&
                                          doctorData?.markdownData.description && (
                                              <span>{doctorData?.markdownData.description}</span>
                                          )}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-2 m-auto">
                                <div className="button-right">
                                    <button className={`${btnStyle}`}>Đặt khám ngay</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="col-sm-12 col-md-10 m-auto">
                                <div className="doctor-position" style={{ fontSize: positionSize }}>
                                    {language === languages.VI
                                        ? doctorData?.positionData
                                            ? `${doctorData?.positionData?.valueVi} ${doctorData?.lastName} ${doctorData?.firstName}`
                                            : `${doctorData.name}`
                                        : doctorData?.positionData
                                        ? `${doctorData?.positionData?.valueEn} ${doctorData?.firstName} ${doctorData?.lastName}`
                                        : `${doctorData.name}`}
                                </div>
                                <div className="doctor-info" style={{ fontSize: fontSize, fontColor: fontColor }}>
                                    {addressClinic
                                        ? `${addressClinic}`
                                        : doctorData?.markdownData &&
                                          doctorData?.markdownData.description && (
                                              <span>{doctorData?.markdownData.description}</span>
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
