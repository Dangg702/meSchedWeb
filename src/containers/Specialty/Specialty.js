import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Collapse, Navbar, Nav, NavItem, NavbarText } from 'reactstrap';

import { path, languages } from '~/utils';
import SearchResult from '~/components/SearchResult';
// import './Specialty.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    getSpecialtyDetail = async (id) => {
        // let doctorData = await doctorService.getDoctorInfoById(id);
        // if (doctorData && doctorData.errCode === 0) {
        //     this.setState({ doctorData: doctorData.data });
        // }
    };

    render() {
        return (
            <>
                <div className="specialty-more-container ">alll</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
