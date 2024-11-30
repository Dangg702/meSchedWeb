import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Navbar, Nav, NavItem, NavbarText } from 'reactstrap';
import { push } from 'connected-react-router';
import { FormattedMessage } from 'react-intl';

import { path } from '~/utils';
import { userService } from '~/services';
import SearchResult from '~/components/SearchResult';
import './SearchResultPage.scss';

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
        let { activeNavItem, searchResList, queryData } = this.state;
        return (
            <>
                <div className="specialty-detail-container ">
                    <div className="specialty-search-wrapper">
                        <div className="specialty-search-block">
                        <FormattedMessage id="banner.search" defaultMessage="search">
                                {(placeholder) => (
                                   <Input
                                   className="specialty-search-input"
                                   type="text"
                                   placeholder={placeholder}
                                   value={this.state.queryData}
                                   onChange={(e) => this.handleChangeInputSearch(e)}
                                   onKeyDown={(e) => {
                                       this.handleSearchKeydown(e);
                                   }}
                               />
                                )}
                            </FormattedMessage>    
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
                                            <FormattedMessage id="all.all" />
                                        </NavbarText>
                                    </NavItem>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${activeNavItem === 'doctor' ? 'active' : ''}`}
                                            onClick={() => this.handleClickNavItem('doctor')}
                                        >
                                            <FormattedMessage id="all.doctor" />
                                        </NavbarText>
                                    </NavItem>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${
                                                activeNavItem === 'specialty' ? 'active' : ''
                                            }`}
                                            onClick={() => this.handleClickNavItem('specialty')}
                                        >
                                            <FormattedMessage id="all.specialty" />
                                        </NavbarText>
                                    </NavItem>
                                    <NavItem>
                                        <NavbarText
                                            className={`search-nav-item ${activeNavItem === 'clinic' ? 'active' : ''}`}
                                            onClick={() => this.handleClickNavItem('clinic')}
                                        >
                                            <FormattedMessage id="all.clinic" />
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
