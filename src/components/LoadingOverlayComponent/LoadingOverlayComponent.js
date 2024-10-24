import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';

const LoadingOverlayComponent = ({ loading, children }) => {
    return (
        <LoadingOverlay
            active={loading}
            spinner
            text="Loading..."
            styles={{
                content: (base) => ({
                    ...base,               // Bảo tồn các style mặc định
                    fontSize: '18px',      // Ví dụ: Tuỳ chỉnh kích thước font
                    color: '#fff',         // Ví dụ: Màu chữ
                    backgroundColor: 'rgba(0, 0, 0, 0.5)' // Ví dụ: Màu nền lớp phủ
                }),
            }}
        >
            {children}
        </LoadingOverlay>
    );
};

const mapStateToProps = (state) => ({
    loading: state.app.loading,
});

export default connect(mapStateToProps)(LoadingOverlayComponent);
