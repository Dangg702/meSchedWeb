import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './ClinicIntro.scss';
import clinicImg from '~/assets/images/clinic/cho-ray.jpg';
import { FormattedMessage } from 'react-intl';

class ClinicIntro extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    render() {
        const {
            clinicData,
            fontSize,
            fontColor,
            positionSize,
            buttonRight,
            btnStyle,
            imageStyle,
            linkTo,
        } = this.props;
        return (
            <>
                <div className="row doctor-info-content py-3 g-0">
                    <div className="col-sm-12 col-md-2">
                        <div className="image-container">
                            <img
                                className={`image rounded-circle ${imageStyle}`}
                                src={clinicData.image ? clinicData.image : clinicImg}
                                alt="avatar"
                            />
                        </div>
                    </div>
                    {buttonRight ? (
                        <>
                            <div className="col-sm-12 col-md-7 m-auto">
                                <div className="doctor-position" style={{ fontSize: positionSize }}>
                                    {clinicData?.name}
                                </div>
                                <div className="doctor-info" style={{ fontSize: fontSize, fontColor: fontColor }}>
                                    {clinicData?.address}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-3 m-auto">
                                <div className="button-right">
                                    <Link to={linkTo} className={`${btnStyle}`}>
                                        <FormattedMessage id="booking.quick-booking" />
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="col-sm-12 col-md-7 m-auto">
                            <div className="doctor-position" style={{ fontSize: positionSize }}>
                                {clinicData?.name}
                            </div>
                            <div className="doctor-info" style={{ fontSize: fontSize, fontColor: fontColor }}>
                                {clinicData?.address}
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClinicIntro);
