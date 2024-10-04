import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { languages, path } from '~/utils';
import * as actions from '~/store/actions';

import './SearchResult.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';
import { Button } from 'reactstrap';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    handleBooking = () => {};

    render() {
        return (
            <div className="specialty-list-item">
                <div className="specialty-list-item-container">
                    <Link to={path.doctorDetail} className="specialty-list-item-link">
                        <div className="left-content">
                            <div className="specialty-list-item-image">
                                <img src={doctorImg} alt="..." />
                            </div>
                            <div className="specialty-list-item-info">
                                <div className="specialty-list-item-name">BS Phan Minh</div>
                                <div className="specialty-list-item-major">Nội tiết</div>
                                <div className="specialty-list-item-address">
                                    79 Đ. Thành Thái, Phường 14, Quận 10, Hồ Chí Minh
                                </div>
                            </div>
                        </div>
                        <div>
                            {/* tiep */}
                            <Link to={`/doctor/:id`} className="btn-book btn">
                                Đặt khám
                            </Link>
                        </div>
                    </Link>
                </div>
            </div>
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
