import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Slider from 'react-slick';

import userService from '../../../services/userService';
import './MedicalFacilities.scss';
import clinicImg from '../../../assets/images/clinic/cho-ray.jpg';
import { FormattedMessage } from 'react-intl';

class MedicalFacilities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics: [],
        };
    }

    componentDidMount() {
        this.getClinics();
    }

    async getClinics() {
        let response = await userService.getClinics();
        console.log('getClinics', response);
        if (response && response.errCode === 0) {
            this.setState({
                clinics: response.data,
            });
        }
    }

    render() {
        let { clinics } = this.state;
        return (
            <>
                <div className="section-wrapper">
                    <div className="section-content">
                        <div className="section-header">
                            <h2 className="section-title">
                                <FormattedMessage id="homepage.clinic" />
                            </h2>
                            <Link to={`/book-appointment/specialty`} className="btn btn-more">
                                <FormattedMessage id="homepage.more" />
                            </Link>
                        </div>

                        <div className="section-container">
                            <Slider {...this.props.settings}>
                                {clinics.map((clinic, index) => (
                                    <div className="section-item-wrapper" key={index}>
                                        <Link
                                            to={`/clinics-examination/${clinic.id}`}
                                            className="section-item-container"
                                        >
                                            <div className="image-container">
                                                <img
                                                    className="image"
                                                    src={clinic.image ? clinic.image : clinicImg}
                                                    alt="..."
                                                />
                                            </div>
                                            <div className="text-description">{clinic.name}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacilities);
