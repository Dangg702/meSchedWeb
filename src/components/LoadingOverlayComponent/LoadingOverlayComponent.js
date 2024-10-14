import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';

const LoadingOverlayComponent = ({ loading, children }) => {
    return (
        <LoadingOverlay active={loading} spinner text="Loading...">
            {children}
        </LoadingOverlay>
    );
};

const mapStateToProps = (state) => ({
    loading: state.app.loading,
});

export default connect(mapStateToProps)(LoadingOverlayComponent);
