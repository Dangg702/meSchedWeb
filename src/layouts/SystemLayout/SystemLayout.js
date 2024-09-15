import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../component/System/Header';

class SystemLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { isLoggedIn } = this.props;

        return (
            <div className="layout-container">
                {/* Header */}
                {isLoggedIn && <Header />}
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

export default connect(mapStateToProps, mapDispatchToProps)(SystemLayout);
