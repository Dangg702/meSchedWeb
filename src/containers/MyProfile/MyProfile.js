import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { path, languages } from '~/utils';
import doctorService from '~/services/doctorService';
import './MyProfile.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class MyFrofile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    render() {
        return (
            <>
                <div className="doctor-info-container ">MyFrofile</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyFrofile);
