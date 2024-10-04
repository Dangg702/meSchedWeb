import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Collapse, Navbar, Nav, NavItem, NavbarText } from 'reactstrap';

import { path, languages } from '~/utils';
import SearchResult from '~/components/SearchResult';
import './SpecialtyDetail.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class SpecialtyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialtyId: -1,
            activeNavItem: 'all',
        };
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    handleClickNavItem = (item) => {
        this.setState({ activeNavItem: item });
    };

    getSpecialtyDetail = async (id) => {
        // let doctorData = await doctorService.getDoctorInfoById(id);
        // if (doctorData && doctorData.errCode === 0) {
        //     this.setState({ doctorData: doctorData.data });
        // }
    };

    render() {
        let { language } = this.props;
        let { activeNavItem } = this.state;
        return (
            <>
                <div className="specialty-detail-container ">
                    <div className="specialty-search-wrapper">
                        <div className="specialty-search-block">
                            <Input
                                className="specialty-search-input"
                                type="text"
                                placeholder="Tìm theo bác sĩ, chuyên khoa, bệnh viện"
                            />
                            <i class="fa-solid fa-magnifying-glass specialty-icon-search"></i>
                            <i class="fa-solid fa-xmark specialty-icon-close"></i>
                        </div>
                        <div className="search-nav-wrapper">
                            <Navbar>
                                <Nav className="search-nav" navbar>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${activeNavItem === 'all' ? 'active' : ''}`}
                                            onClick={() => this.handleClickNavItem('all')}
                                        >
                                            Tất cả
                                        </NavbarText>
                                    </NavItem>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${activeNavItem === 'doctor' ? 'active' : ''}`}
                                            onClick={() => this.handleClickNavItem('doctor')}
                                        >
                                            Bác sĩ
                                        </NavbarText>
                                    </NavItem>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${
                                                activeNavItem === 'hospital' ? 'active' : ''
                                            }`}
                                            onClick={() => this.handleClickNavItem('hospital')}
                                        >
                                            Bệnh viện
                                        </NavbarText>
                                    </NavItem>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${activeNavItem === 'Clinic' ? 'active' : ''}`}
                                            onClick={() => this.handleClickNavItem('Clinic')}
                                        >
                                            Phòng khám
                                        </NavbarText>
                                    </NavItem>
                                </Nav>
                            </Navbar>
                        </div>
                    </div>
                    <div className="specialty-list-wrapper">
                        <div className="specialty-list">
                            <SearchResult />
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyDetail);