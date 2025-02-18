import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { path } from '~/utils';
import * as actions from '~/store/actions';

import './UserProfileAvatar.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { userService } from '~/services';

class UserProfileAvatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
        };
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    toggle = () => {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    };

    handleLogout = () => {
        userService.logout();
        this.props.processLogout();
    };

    render() {
        const { userInfo } = this.props;
        return (
            <>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle data-toggle="dropdown" tag="span" className="title-dropdown">
                        <img
                            className={`${this.props.className} image rounded-circle`}
                            src={userInfo.image ? userInfo.image : doctorImg}
                            alt="avatar"
                        />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-wrapper">
                        <div className="dropdown-menu-item">
                            <Link to={path.MY_PROFILE}>
                                <FormattedMessage id="homeHeader.MyProfile" />
                            </Link>
                        </div>
                        <div className="dropdown-menu-item">
                            <Link to={path.MY_APPOINTMENT}>
                                <FormattedMessage id="homeHeader.MyAppointment" />
                            </Link>
                        </div>
                        <div className="dropdown-menu-item" onClick={this.handleLogout}>
                            <FormattedMessage id="homeHeader.Logout" />
                        </div>
                    </DropdownMenu>
                </Dropdown>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileAvatar);
