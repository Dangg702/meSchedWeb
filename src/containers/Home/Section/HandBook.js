import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';

import './HandBook.scss';
import handBookImg from '../../../assets/images/handBook/benh-vien-chua-thoai-hoa-cot-song-tphcm.png';
import { FormattedMessage } from 'react-intl';

class HandBook extends Component {
    // eslint-disable-next-line no-useless-constructor
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
                                <FormattedMessage id="homepage.handbook" />
                            </h2>
                            <button type="button" className="btn btn-more">
                                <FormattedMessage id="homepage.more" />
                            </button>
                        </div>

                        <div className="section-container">
                            <Slider {...this.props.settings}>
                                <div className="section-item-wrapper">
                                    <a href="/">
                                        <div className="image-container">
                                            <img className=" handbook-image" src={handBookImg} alt="..." />
                                        </div>
                                        <div className="text-description">
                                            6 địa chỉ khám chữa Thoái đốt sống cổ uy tin tại TPHCM
                                        </div>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/">
                                        <div className="image-container">
                                            <img className=" handbook-image" src={handBookImg} alt="..." />
                                        </div>
                                        <span className="text-description">
                                            6 địa chỉ khám chữa Thoái đốt sống cổ uy tin tại TPHCM
                                        </span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/">
                                        <div className="image-container">
                                            <img className=" handbook-image" src={handBookImg} alt="..." />
                                        </div>
                                        <span className="text-description">
                                            6 địa chỉ khám chữa Thoái đốt sống cổ uy tin tại TPHCM
                                        </span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/">
                                        <div className="image-container">
                                            <img className=" handbook-image" src={handBookImg} alt="..." />
                                        </div>
                                        <span className="text-description">
                                            6 địa chỉ khám chữa Thoái đốt sống cổ uy tin tại TPHCM
                                        </span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/">
                                        <div className="image-container">
                                            <img className=" handbook-image" src={handBookImg} alt="..." />
                                        </div>
                                        <span className="text-description">
                                            6 địa chỉ khám chữa Thoái đốt sống cổ uy tin tại TPHCM
                                        </span>
                                    </a>
                                </div>
                                <div className="section-item-wrapper">
                                    <a href="/">
                                        <div className="image-container">
                                            <img className="handbook-image" src={handBookImg} alt="..." />
                                        </div>
                                        <span className="text-description">
                                            6 địa chỉ khám chữa Thoái đốt sống cổ uy tin tại TPHCM
                                        </span>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
