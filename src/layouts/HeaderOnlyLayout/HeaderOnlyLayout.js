import React, { Component } from 'react';
import { connect } from 'react-redux';

import HomeHeader from '../component/HomeHeader';

class HeaderOnlyLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const isHomePage = window.location && window.location.pathname === '/';

        return (
            <div className="layout-container">
                {/* Header */}
                <HomeHeader isShowBanner={isHomePage} />
                {/* content */}
                {this.props.children}
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

export default connect(mapStateToProps, mapDispatchToProps)(HeaderOnlyLayout);
