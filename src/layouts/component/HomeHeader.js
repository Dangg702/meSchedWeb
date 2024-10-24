import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
    Dropdown,
} from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { languages, path } from '../../utils/constant';
import { changeLanguageApp } from '../../store/actions';
import UserProfileAvatar from '~/components/UserProfileAvatar';

import './HomeHeader.scss';
import { push } from 'connected-react-router';

class HomeHeader extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.state = {
            isOpen: false,
            dropdownMenu: false,
            dropdownMenu2: false,
            dropdownUserMenu: false,
            subNavActive: null,
            searchVal: '',
        };
    }

    componentDidMount() {
        let { location } = this.props;
        let pathName = location.pathname;
        let subNavActive = '';
        if (pathName.includes('book-appointment')) {
            subNavActive = pathName.split('/').pop();
        }
        this.setState({ subNavActive });
    }
    componentDidUpdate(prevProps, prevState) {
        let { location } = this.props;
        let pathName = location.pathname;
        if (pathName !== prevProps.location.pathname) {
            let subNavActive = '';
            if (pathName.includes('book-appointment')) {
                subNavActive = pathName.split('/').pop();
            }
            this.setState({ subNavActive });
        }
    }

    toggle() {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    }

    onMouseEnter(menuName) {
        // Ẩn tất cả menu trước khi hiển thị menu được hover
        this.setState({
            dropdownMenu: false,
            dropdownMenu2: false,
            dropdownUserMenu: false,
            [menuName]: true,
        });
    }

    onMouseLeave() {
        // Ẩn tất cả menu khi rời chuột khỏi các menu
        this.setState({
            dropdownMenu: false,
            dropdownMenu2: false,
            dropdownUserMenu: false,
        });
    }

    changLanguage = (language) => {
        // redux event fired: actions
        this.props.changeLanguageRedux(language);
    };

    handleChangeNavItem = (type) => {
        this.setState({ subNavActive: type });
        this.props.navigate(`/book-appointment/${type}`);
    };

    handleChangeSearchVal = (e) => {
        this.setState({ searchVal: e.target.value });
    };

    handleSearch = () => {
        this.props.navigate(path.SEARCH + `?type=all&q=${this.state.searchVal}`);
    };

    handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    };

    render() {
        let { language, isLoggedIn, userInfo, isSubNav } = this.props;
        let isShowBanner = this.props.isShowBanner ? true : false;
        let { subNavActive, searchVal } = this.state;
        return (
            <>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <Navbar className="navbar-wrapper" color="faded" light expand="md" fixed="top">
                            <NavbarBrand href="/" className="h-100">
                                <div className="header-logo"></div>
                            </NavbarBrand>
                            <NavbarToggler onClick={() => this.toggle()} />
                            {/* <div> */}
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ms-auto" navbar>
                                    <UncontrolledDropdown
                                        nav
                                        inNavbar
                                        onMouseOver={() => this.onMouseEnter('dropdownMenu')}
                                        onMouseLeave={() => this.onMouseLeave('dropdownMenu')}
                                        isOpen={this.state.dropdownMenu}
                                    >
                                        <DropdownToggle nav caret>
                                            <FormattedMessage id={'homeHeader.Booking'} />
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                                <NavLink className="nav-item-wrapper" href="/book-appointment/doctor">
                                                    <FormattedMessage id={'homeHeader.Book-a-doctors-appointment'} />
                                                    <span>
                                                        <FormattedMessage
                                                            id={'homeHeader.Make-an-appointment-without-waiting'}
                                                        />
                                                    </span>
                                                </NavLink>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <NavLink className="nav-item-wrapper" href="/book-appointment/clinic">
                                                    <FormattedMessage id={'homeHeader.Book-a-hospital-examination'} />
                                                    <span>
                                                        <FormattedMessage
                                                            id={'homeHeader.Book-examination-pay-receive-results'}
                                                        />
                                                    </span>
                                                </NavLink>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <NavLink
                                                    className="nav-item-wrapper"
                                                    href="/book-appointment/specialty"
                                                >
                                                    <FormattedMessage id={'homeHeader.Book-a-specialty-visit'} />
                                                    <span>
                                                        <FormattedMessage
                                                            id={'homeHeader.Diverse-specialties-and-services'}
                                                        />
                                                    </span>
                                                </NavLink>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <NavItem>
                                        <NavLink href="/components/">
                                            <FormattedMessage id={'homeHeader.Medical-news'} />
                                        </NavLink>
                                    </NavItem>
                                    <UncontrolledDropdown
                                        nav
                                        inNavbar
                                        onMouseOver={() => this.onMouseEnter('dropdownMenu2')}
                                        onMouseLeave={() => this.onMouseLeave('dropdownMenu2')}
                                        isOpen={this.state.dropdownMenu2}
                                    >
                                        <DropdownToggle nav caret>
                                            <FormattedMessage id={'homeHeader.For-medical-staff'} />
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                                <NavLink className="nav-item-wrapper" href="/components/">
                                                    <FormattedMessage id={'homeHeader.Doctor'} />
                                                </NavLink>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <NavLink className="nav-item-wrapper" href="/components/">
                                                    <FormattedMessage id={'homeHeader.Clinic'} />
                                                </NavLink>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                                {/* <NavbarText className="ms-3">
                                    {isLoggedIn ? (
                                        <UserProfileAvatar userInfo={userInfo} className="image-avatar-user" />
                                    ) : (
                                        <Link to={path.LOGIN} className="btn btn-login">
                                            <FormattedMessage id={'auth.login'} />
                                        </Link>
                                    )}
                                </NavbarText>
                                <NavbarText className="ms-3 language-btn">
                                    <div className={language === languages.VI ? 'language action' : 'language'}>
                                        <span onClick={() => this.changLanguage(languages.VI)}>VI</span>
                                    </div>
                                    <div
                                        className={language === languages.EN ? 'ms-3 language action' : 'ms-3 language'}
                                    >
                                        <span onClick={() => this.changLanguage(languages.EN)}>EN</span>
                                    </div>
                                </NavbarText> */}
                            </Collapse>
                            <div className="right-nav-wrapper">
                                <NavbarText className="ms-3">
                                    {isLoggedIn ? (
                                        <UserProfileAvatar userInfo={userInfo} className="image-avatar-user" />
                                    ) : (
                                        <Link to={path.LOGIN} className="btn btn-login">
                                            <FormattedMessage id={'auth.login'} />
                                        </Link>
                                    )}
                                </NavbarText>
                                <NavbarText className="ms-3 language-btn">
                                    <div className={language === languages.VI ? 'language action' : 'language'}>
                                        <span onClick={() => this.changLanguage(languages.VI)}>VI</span>
                                    </div>
                                    <div
                                        className={language === languages.EN ? 'ms-3 language action' : 'ms-3 language'}
                                    >
                                        <span onClick={() => this.changLanguage(languages.EN)}>EN</span>
                                    </div>
                                </NavbarText>
                            </div>
                            {/* </div> */}
                        </Navbar>
                    </div>
                </div>
                {isShowBanner ? (
                    <div className="home-header-banner">
                        <div className="row g-0 w-100">
                            <div className="col-sm-12 banner-content-wrapper">
                                <div className="title">
                                    <FormattedMessage id="banner.title" />
                                </div>
                                <div className="search-wrapper">
                                    <i
                                        className="fa-solid fa-magnifying-glass search-icon"
                                        onClick={() => this.handleSearch()}
                                    ></i>
                                    <FormattedMessage id="banner.search" defaultMessage="search">
                                        {(placeholder) => (
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder={placeholder}
                                                value={searchVal}
                                                onChange={(e) => this.handleChangeSearchVal(e)}
                                                onKeyDown={(e) => this.handleSearchKeyDown(e)}
                                            />
                                        )}
                                    </FormattedMessage>
                                </div>
                                <div className="sub-title">
                                    <FormattedMessage id="banner.subtitle" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {isSubNav ? (
                    <div className="banner-nav-wrapper">
                        <div className="row g-0 banner-nav">
                            <div
                                className={`col-md-4 col-lg-4 banner-nav-item ${
                                    subNavActive === 'doctor' ? 'active' : ''
                                }`}
                                onClick={() => this.handleChangeNavItem('doctor')}
                            >
                                <i className="fa-regular fa-snowflake me-2"></i>
                                Đặt khám bác sĩ
                            </div>
                            <div
                                className={`col-md-4 col-lg-4 banner-nav-item ${
                                    subNavActive === 'clinic' ? 'active' : ''
                                }`}
                                onClick={() => this.handleChangeNavItem('clinic')}
                            >
                                <i className="fa-regular fa-building me-2"></i>
                                Đặt khám bệnh viện
                            </div>
                            <div
                                className={`col-md-4 col-lg-4 banner-nav-item ${
                                    subNavActive === 'specialty' ? 'active' : ''
                                }`}
                                onClick={() => this.handleChangeNavItem('specialty')}
                            >
                                <i className="fa-regular fa-calendar-plus me-2"></i>Đặt khám chuyên khoa
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguageRedux: (language) => dispatch(changeLanguageApp(language)),
        navigate: (path) => dispatch(push(path)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
