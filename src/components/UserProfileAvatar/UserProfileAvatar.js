import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { languages, path } from '~/utils';
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
        const { userInfo, processLogout } = this.props;
        return (
            <>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle data-toggle="dropdown" tag="span" className="title-dropdown">
                        <img className={`${this.props.className} image rounded-circle`} src={doctorImg} alt="avatar" />
                        {/* {userInfo && userInfo.firstName} */}
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-wrapper">
                        <div className="dropdown-menu-item">
                            <Link to={path.MY_PROFILE}>Hồ sơ của bạn</Link>
                        </div>
                        <div className="dropdown-menu-item">
                            <Link to={path.MY_APPOINTMENT}>Lịch hẹn của bạn</Link>
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
