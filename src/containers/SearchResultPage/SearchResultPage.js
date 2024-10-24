import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input, Collapse, Navbar, Nav, NavItem, NavbarText } from 'reactstrap';
import { push } from 'connected-react-router';

import { path, languages } from '~/utils';
import { userService } from '~/services';
import SearchResult from '~/components/SearchResult';
import './SearchResultPage.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class SearchResultPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeNavItem: 'all',
            searchResList: [],
            queryData: null,
        };
    }

    componentDidMount() {
        const { location } = this.props;
        const { activeNavItem, queryData } = this.state;
        const searchParams = new URLSearchParams(location.search);
        let typeSearch = searchParams.get('type');
        let qSearch = searchParams.get('q');

        this.setState({ activeNavItem: typeSearch, queryData: qSearch });
        if (typeSearch && qSearch) {
            this.getSearchResult(typeSearch, qSearch);
        } else {
            this.getSearchResult(activeNavItem, queryData);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.search !== this.props.location.search) {
            const { location } = this.props;
            const searchParams = new URLSearchParams(location.search);
            let typeSearch = searchParams.get('type');
            let qSearch = searchParams.get('q');
            this.setState({ activeNavItem: typeSearch, queryData: qSearch });
            this.getSearchResult(typeSearch, qSearch);
        }
    }

    handleClickNavItem = (item) => {
        const { queryData } = this.state;
        this.setState({ activeNavItem: item });
        this.props.navigate(path.SEARCH + `?type=${item}&q=${queryData}`);
    };

    getSearchResult = async (type, q) => {
        let res;
        if (type === 'specialty') {
            res = await userService.searchDoctorBySpecialty(q);
        } else if (type === 'doctor') {
            res = await userService.searchDoctorByName(q);
        } else if (type === 'clinic') {
            res = await userService.searchClinic(q);
        } else if (type === 'all') {
            res = await userService.searchAll(q);
        }

        if (res && res.errCode === 0) {
            this.setState({ searchResList: res.data });
        } else {
            this.setState({ searchResList: [] });
        }
    };

    handleChangeInputSearch = (e) => {
        this.setState({ queryData: e.target.value });
    };

    handleSearch = () => {
        const { activeNavItem, queryData } = this.state;
        this.props.navigate(path.SEARCH + `?type=${activeNavItem}&q=${queryData}`);
    };

    handleSearchKeydown(e) {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    }

    handleClearSearch = () => {
        this.setState({ queryData: '' });
    };

    render() {
        let { language } = this.props;
        let { activeNavItem, searchResList, queryData } = this.state;
        console.log(`searchResList ${activeNavItem}`, searchResList);
        return (
            <>
                <div className="specialty-detail-container ">
                    <div className="specialty-search-wrapper">
                        <div className="specialty-search-block">
                            <Input
                                className="specialty-search-input"
                                type="text"
                                placeholder="Tìm theo bác sĩ, chuyên khoa, bệnh viện"
                                value={this.state.queryData}
                                onChange={(e) => this.handleChangeInputSearch(e)}
                                onKeyDown={(e) => {
                                    this.handleSearchKeydown(e);
                                }}
                            />
                            <i
                                className="fa-solid fa-magnifying-glass specialty-icon-search"
                                onClick={() => this.handleSearch()}
                            ></i>
                            {queryData && (
                                <i
                                    className="fa-solid fa-xmark specialty-icon-close"
                                    onClick={() => this.handleClearSearch()}
                                ></i>
                            )}
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
                                                activeNavItem === 'specialty' ? 'active' : ''
                                            }`}
                                            onClick={() => this.handleClickNavItem('specialty')}
                                        >
                                            Chuyên khoa
                                        </NavbarText>
                                    </NavItem>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${activeNavItem === 'clinic' ? 'active' : ''}`}
                                            onClick={() => this.handleClickNavItem('clinic')}
                                        >
                                            Bệnh viện / Phòng khám
                                        </NavbarText>
                                    </NavItem>
                                </Nav>
                            </Navbar>
                        </div>
                    </div>
                    <div className="specialty-list-wrapper">
                        <div className="specialty-list">
                            <SearchResult resultData={searchResList} />
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
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultPage);
