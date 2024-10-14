import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import './Specialty.scss';
import specialtyImg from '../../../assets/images/specialty/Chanthuongchinhhinh.webp';
import { userService } from '~/services';
import { languages } from '~/utils';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],
        };
    }

    async componentDidMount() {
        let res = await userService.getSpecialty();
        if (res && res.errCode === 0) {
            this.setState({ listSpecialty: res.data ? res.data : [] });
        }
    }

    render() {
        let { language } = this.props;
        let { listSpecialty } = this.state;
        console.log(listSpecialty);
        return (
            <>
                <div className="section-wrapper">
                    <div className="section-content">
                        <div className="section-header">
                            <h2 className="section-title">
                                <FormattedMessage id="homepage.specialty" />
                            </h2>
                            <Link to={`/book-appointment/specialty`} className="btn btn-more">
                                <FormattedMessage id="homepage.more" />
                            </Link>
                        </div>

                        <div className="section-container">
                            <Slider {...this.props.settings}>
                                {listSpecialty.map((item, index) => {
                                    return (
                                        <div className="section-item-wrapper" key={index}>
                                            <Link
                                                to={`/specialist-examination/${item.id}`}
                                                className="section-item-container"
                                            >
                                                <div className="image-container">
                                                    <img className="image" src={specialtyImg} alt="..." />
                                                </div>
                                                <div className="text-description">
                                                    {language === languages.VI ? item.valueVi : item.valueEn}
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
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
