import React, { Component } from 'react';
import { connect } from 'react-redux';
import doctorImg from '~/assets/images/doctor/user-default.jfif'; // Ảnh mặc định cho người dùng
import './MyProfile.scss';

class MyProfile extends Component {
    renderGender = (gender) => {
        switch (gender) {
            case 'M':
                return 'Nam';
            case 'F':
                return 'Nữ';
            case 'O':
                return 'Khác';
            default:
                return 'Không xác định';
        }
    };

    render() {
        const { userInfo } = this.props;

        return (
            <div className="container">
                <h1 className="title">Thông Tin Cá Nhân</h1>
                {userInfo ? (
                    <div className="card">
                        <div className="header">
                            <img src={userInfo.avatar || doctorImg} alt="avatar" className='avatar' />
                            <h2 className="name">
                                {userInfo.firstName} {userInfo.lastName}
                            </h2>
                            <p className="email">{userInfo.email}</p>
                        </div>
                        <div className="details">
                            <p>
                                <strong>Giới tính:</strong> {this.renderGender(userInfo.gender)}
                            </p>
                            <p>
                                <strong>Địa chỉ:</strong> {userInfo.address}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="loadingText">Đang tải thông tin người dùng...</p>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(MyProfile);
