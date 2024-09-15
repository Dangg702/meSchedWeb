import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from 'react-slick';

import userService from '../../../services/userService';
import { languages } from '~/utils';
import doctorImg from '../../../assets/images/doctor/user-default.jfif';

import './OutStandingDoctor.scss';
import { FormattedMessage } from 'react-intl';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctors: [],
        };
    }

    componentDidMount() {
        this.getTopDoctors(5);
    }

    async getTopDoctors(limit) {
        try {
            const response = await userService.getTopDoctors(limit);
            if (response && response.errCode === 0) {
                this.setState({
                    doctors: response.doctors,
                });
            }
        } catch (error) {
            console.log('getTopDoctors: ', error);
        }
    }

    render() {
        let { doctors } = this.state;
        let language = this.props.language;
        return (
            <>
                <div className="section-wrapper">
                    <div className="section-content">
                        <div className="section-header">
                            <h2 className="section-title">
                                <FormattedMessage id="homepage.outStanding-doctor" />
                            </h2>
                            <button type="button" className="btn btn-more">
                                <FormattedMessage id="homepage.more" />
                            </button>
                        </div>

                        <div className="section-container">
                            <Slider {...this.props.settings}>
                                {doctors.map((doctor, index) => (
                                    <div className="section-item-wrapper" key={index}>
                                        <Link to={`/doctor/${doctor.id}`} className="section-item-container">
                                            <>
                                                <div className="image-container">
                                                    <img className="image doctor-avatar " src={doctorImg} alt="..." />
                                                </div>
                                                <div className="position-wrapper text-center">
                                                    <div className="position-name">
                                                        <div className="position">
                                                            {language === languages.VI
                                                                ? doctor.positionData.valueVi
                                                                : doctor.positionData.valueEn}
                                                        </div>
                                                        <div className="name">
                                                            {language === languages.VI
                                                                ? `${doctor.lastName} ${doctor.firstName}`
                                                                : `${doctor.firstName} ${doctor.lastName}`}
                                                        </div>
                                                    </div>
                                                    <div className="specialty">Thần kinh</div>
                                                </div>
                                            </>
                                        </Link>
                                    </div>
                                ))}
                            </Slider>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
