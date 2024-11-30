import { connect } from 'react-redux';
import { Component } from 'react';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { path, USER_ROLE } from '~/utils';
import * as actions from '../../store/actions';
import { userService } from '../../services';
import FormikForm from '~/components/Form/FormikForm';
import './Auth.scss';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.initialState
        };
    }

    initialState = {
        email: '',
        password: '',
        loginError: '',
        isShowLogin: false,
    };

    redirectBasedOnRole = (userRole) => {
        if (userRole === USER_ROLE.ADMIN) {
            this.props.navigate(path.SYSTEM_USER_MANAGE);
        } else if (userRole === USER_ROLE.PATIENT) {
            this.props.navigate(path.HOME);
        } else if (userRole === USER_ROLE.DOCTOR) {
            this.props.navigate(path.SYSTEM_DOCTOR_SCHEDULE_MANAGE);
        }
    };

    handleChangeInputForm = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleShowPassword = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    handleLogin = async (values) => {
        const { email, password } = values;
        try {
            let result = await userService.login(email, password);
            if (result.errCode !== 0) {
                toast.error('Login fail: ' + result.message);
            } else {
                this.props.userLoginSuccess(result.data, result.tokens?.accessToken);
                this.redirectBasedOnRole(result.data.roleId);
            }
        } catch (e) {
            console.error('Login error: ' + e);
        }
    };

    handleKeydown = async (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            await this.handleLogin();
        }
    };

    handleBackHome = () => {
        this.props.navigate(path.HOME);
    };

    render() {
        let { isShowPassword } = this.state;
        return (
            <div className="login-background">
                <div className="back-btn" onClick={() => this.handleBackHome()}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </div>
                <div className="login-container">
                    <div className="row g-0 login-content">
                        <FormikForm
                            formTitle="auth.login"
                            formFields={[
                                {
                                    name: 'email',
                                    type: 'email',
                                    icon: 'fa-regular fa-user icon',
                                    placeholder: 'form.email',
                                    validation: Yup.string()
                                        .email('Invalid email address')
                                        .required('Email is required'),
                                },
                                {
                                    name: 'password',
                                    type: isShowPassword ? 'text' : 'password',
                                    placeholder: 'form.password',
                                    icon: isShowPassword ? 'fa-regular fa-eye icon' : 'fa-regular fa-eye-slash icon',
                                },
                            ]}
                            handleChange={this.handleChangeInputForm}
                            onSubmit={this.handleLogin}
                            isShowPassword={isShowPassword}
                            togglePasswordVisibility={this.handleShowPassword}
                            buttonTitle="auth.login"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.app.language,
        userRole: state.user.userRole,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {    
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo, token) => dispatch(actions.userLoginSuccess(userInfo, token)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
