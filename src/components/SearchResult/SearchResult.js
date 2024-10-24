import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { languages, path } from '~/utils';
import * as actions from '~/store/actions';

import './SearchResult.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    handleBooking = () => {};

    render() {
        const { resultData, language } = this.props;
        console.log('resultData', resultData);
        return (
            <>
                {resultData && resultData.length > 0 ? (
                    resultData.map((item, index) => (
                        <div className="search-list-item" key={index}>
                            <div className="search-list-item-container">
                                <div className="row g-0 search-list-item-link">
                                    <div className="col-sm-12 col-md-3">
                                        <div className="search-list-item-image">
                                            <img
                                                src={
                                                    item['doctorInfoData.image']
                                                        ? item['doctorInfoData.image']
                                                        : doctorImg
                                                }
                                                alt="..."
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <div className="search-list-item-info">
                                            <div className="search-list-item-name">
                                                {language === languages.VI
                                                    ? `BS ${item['doctorInfoData.lastName']} ${item['doctorInfoData.firstName']}`
                                                    : `Dr. ${item['doctorInfoData.firstName']} ${item['doctorInfoData.lastName']}`}
                                            </div>
                                            <div className="search-list-item-major">
                                                {language === languages.VI
                                                    ? item['specialtyData.valueVi']
                                                    : item['specialtyData.valueEn']}
                                            </div>
                                            <div className="search-list-item-address">
                                                {item['clinicData.name']} <br />
                                                {item['clinicData.address']}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-3">
                                        <Link to={`/doctor/${item['doctorInfoData.id']}`} className="btn-book btn">
                                            Đặt khám
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">Không có dữ liệu</div>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
