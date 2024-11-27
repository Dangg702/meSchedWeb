import React, { Component } from 'react';
import { connect } from 'react-redux';

import './About.scss';

class About extends Component {
    render() {
        return (
            <>
                <div className="about-wrapper">
                    <div className="section-content">
                        <div className="section-header">
                            <h2 className="section-title text-center pb-4 pt-3">Về chúng tôi</h2>
                        </div>

                        <div className="section-container row g-0">
                            <div className="col-sm-12 col-md-6">
                                <div className="about-video pb-3 ps-3">
                                    <iframe
                                        width="100%"
                                        height="331"
                                        src="https://www.youtube.com/embed/FyDQljKtWnI"
                                        title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 align-self-center">
                                <div className="about-content">
                                    <h1 style={{ color: '#7bd3ea' }}>Ứng dụng đặt khám</h1>
                                    <div className="detail px-3">
                                        Chúng tôi xây dựng nền tảng y tế thông minh với sứ mệnh rút ngắn khoảng cách
                                        giữa Bệnh nhân, Bác sĩ và các Cơ sở y tế
                                    </div>
                                </div>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
