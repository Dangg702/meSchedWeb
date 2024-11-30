import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

import { path } from '~/utils';
import './HomeFooter.scss';
class HomeFooter extends Component {
    render() {
        return (
            <>
                <div className="footer-wrapper container-fluid">
                    <div className="row g-0">
                        <div className="col-6 col-md-3 col-sm-12">&copy; MedSched</div>
                        <div className="col-6 col-md-3 col-sm-12">
                            <h5>Về MedSched</h5>
                            <a href="/">Liên hệ</a>
                        </div>
                        <div className="col-6 col-md-3 col-sm-12">
                            <h5>Dịch vụ</h5>
                            <Link to={'/book-appointment/doctor'}>Đặt khám bác sĩ</Link>
                            {/* <a href="#">Đặt khám bác sĩ</a> */}
                            <br />
                            <Link to={'/book-appointment/clinic'}>Đặt khám bệnh viện</Link>
                            <br />
                            <Link to={'/book-appointment/specialty'}>Đặt khám chuyên khoa</Link>
                            <br />
                            <Link to={path.CHATAI}>Hỏi đáp sức khỏe</Link>
                            <br />
                        </div>
                        <div className="col-6 col-md-3 col-sm-12">
                            <h5>Hỗ trợ</h5>
                            <a href="/">Hỗ trợ khách hàng</a>
                        </div>
                    </div>
                    <div className="row g-0 pt-4">
                        <div className="col text-center">&copy; MedSched</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
