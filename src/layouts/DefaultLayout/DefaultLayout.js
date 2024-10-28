import React, { Component } from 'react';
import { connect } from 'react-redux';

import HomeHeader from '../component/HomeHeader';
import HomeFooter from '../component/HomeFooter';

class DefaultLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const isHomePage = window.location && window.location.pathname === '/';
        const isBookApmt = window.location && window.location.pathname.includes('/book-appointment');

        return (
            <div className="layout-container" style={{ height: 'auto' }}>
                {/* Header */}
                <HomeHeader isShowBanner={isHomePage || isBookApmt} isSubNav={isBookApmt} />
                {/* content */}
                <div className="layout-content">{this.props.children}</div>
                {/* Footer */}
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
