import React, { Component } from 'react';
import { connect } from 'react-redux';
import doctorImg from '~/assets/images/doctor/user-default.jfif'; // Ảnh mặc định cho người dùng

class MyProfile extends Component {
    componentDidMount() {
        const { userInfo } = this.props;
        console.log('User Info from Redux:', userInfo);
    }

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
            <div style={styles.container}>
                <h1 style={styles.title}>Thông Tin Cá Nhân</h1>
                {userInfo ? (
                    <div style={styles.card}>
                        <div style={styles.header}>
                            <img
                                src={userInfo.avatar || doctorImg}
                                alt="avatar"
                                style={styles.avatar}
                            />
                            <h2 style={styles.name}>
                                {userInfo.firstName} {userInfo.lastName}
                            </h2>
                            <p style={styles.email}>{userInfo.email}</p>
                        </div>
                        <div style={styles.details}>
                            <p>
                                <strong>Giới tính:</strong>{' '}
                                {this.renderGender(userInfo.gender)}
                            </p>
                            <p>
                                <strong>Địa chỉ:</strong> {userInfo.address}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p style={styles.loadingText}>Đang tải thông tin người dùng...</p>
                )}
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '400px',
        padding: '20px',
        textAlign: 'center',
    },
    header: {
        position: 'relative',
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        marginBottom: '10px',
    },
    name: {
        fontSize: '1.5rem',
        color: '#007bff',
        margin: '10px 0',
    },
    email: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '20px',
    },
    details: {
        fontSize: '1rem',
        color: '#333',
    },
    loadingText: {
        fontSize: '1.2rem',
        color: '#666',
        marginTop: '20px',
    },
};

const mapStateToProps = (state) => ({
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(MyProfile);
