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
                overlay: (base) => ({
                    ...base,
                    zIndex: 100000000000,
                }),
                content: (base) => ({
                    ...base,
                    // color: 'white',
                }),
            }}
        >
            {children}
        </LoadingOverlay>
    );
};

LoadingOverlay.propTypes = undefined; //fix warning

const mapStateToProps = (state) => ({
    loading: state.app.loading,
});

export default connect(mapStateToProps)(LoadingOverlayComponent);
