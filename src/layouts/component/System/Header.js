import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

import * as actions from '~/store/actions';
import Navigator from '~/components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import { languages, USER_ROLE } from '~/utils/constant';
import './Header.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        };
    }

    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            if (userInfo.roleId === USER_ROLE.ADMIN) {
                menu = adminMenu;
            } else if (userInfo.roleId === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({ menuApp: menu });
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        const { menuApp } = this.state;
        const handleChangeLanguage = (language) => {
            this.props.changeLanguage(language);
        };

        return (
            <div className="header-container">
                <div className="header-tabs-container">
                    <Navigator menus={menuApp && menuApp} />
                </div>
                <div className="header-right">
                    <div className="welcome">
                        <FormattedMessage id="homeHeader.Welcome" />,{' '}
                        {userInfo && userInfo.firstName ? userInfo.firstName : ''}
                    </div>
                    <div className="languages">
                        <span
                            className={language === languages.VI ? 'language active' : 'language'}
                            onClick={() => handleChangeLanguage(languages.VI)}
                        >
                            VI
                        </span>
                        <span
                            className={language === languages.EN ? 'language active' : 'language'}
                            onClick={() => handleChangeLanguage(languages.EN)}
                        >
                            EN
                        </span>
                    </div>

                    <div className="btn btn-logout" onClick={processLogout} title="Log out">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguage: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
