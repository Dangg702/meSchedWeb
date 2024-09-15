import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';

import './Specialty.scss';
import specialtyImg from '../../../assets/images/specialty/Chanthuongchinhhinh.webp';

class Specialty extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="section-wrapper">
                    <div className="section-content">
                        <div className="section-header">
                            <h2 className="section-title">
                                <FormattedMessage id="homepage.specialty" />
                            </h2>
                            <button type="button" className="btn btn-more">
                                <FormattedMessage id="homepage.more" />
                            </button>
                        </div>

                        <div className="section-container">
                            <Slider {...this.props.settings}>
                                <div className="section-item-wrapper">
                                    <a href="/" className="section-item-container">
                                        <div className="image-container">
                                            <img className="image" src={specialtyImg} alt="..." />
                                        </div>
                                        <div className="text-description">Chấn thương chỉnh hình</div>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/" className="section-item-container">
                                        <div className="image-container">
                                            <img className="image" src={specialtyImg} alt="..." />
                                        </div>
                                        <span className="text-description">Chấn thương chỉnh hình</span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/" className="section-item-container">
                                        <div className="image-container">
                                            <img className="image" src={specialtyImg} alt="..." />
                                        </div>
                                        <span className="text-description">Chấn thương chỉnh hình</span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/" className="section-item-container">
                                        <div className="image-container">
                                            <img className="image" src={specialtyImg} alt="..." />
                                        </div>
                                        <span className="text-description">Chấn thương chỉnh hình</span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/" className="section-item-container">
                                        <div className="image-container">
                                            <img className="image" src={specialtyImg} alt="..." />
                                        </div>
                                        <span className="text-description">Chấn thương chỉnh hình</span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/" className="section-item-container">
                                        <div className="image-container">
                                            <img className="image" src={specialtyImg} alt="..." />
                                        </div>
                                        <span className="text-description">Chấn thương chỉnh hình</span>
                                    </a>
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
