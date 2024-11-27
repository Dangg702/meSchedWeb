import React, { Component } from 'react';
import { connect } from 'react-redux';

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
                            <a href="#">Liên hệ</a>
                        </div>
                        <div className="col-6 col-md-3 col-sm-12">
                            <h5>Dịch vụ</h5>
                            <a href="#">Đặt khám bác sĩ</a>
                            <br />
                            <a href="#">Đặt khám bệnh viện</a>
                            <br />
                            <a href="#">Đặt khám phòng khám</a>
                            <br />
                            <a href="#">Hỏi đáp sức khỏe</a>
                            <br />
                        </div>
                        <div className="col-6 col-md-3 col-sm-12">
                            <h5>Hỗ trợ</h5>
                            <a href="#">Hỗ trợ khách hàng</a>
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
