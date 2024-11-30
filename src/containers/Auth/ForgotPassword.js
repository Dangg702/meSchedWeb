import { connect } from 'react-redux';
import { Component } from 'react';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import * as Yup from 'yup';

import { path } from '~/utils';
import * as actions from '../../store/actions';
import { userService } from '../../services';
import FormikForm from '~/components/Form/FormikForm';

import './Auth.scss';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isSendEmail: false,
            otpCode: '',
            isVerify: false,
            password: '',
            rePassword: '',
            isShowPassword: false,
            isShowRePassword: false,
        };
        this.debouncedOnChange = debounce(this.handleInputChange, 400);
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSendOTP = async (values) => {
        try {
            const { email } = values;
            this.setState({ email: email });

            let result = await userService.forgotPasswordSendOtp(email);
            console.log('handleSendOTP', result);
            if (result.errCode !== 0) {
                toast.error(result.message);
            } else {
                this.setState({ isSendEmail: true });
                toast.success('Check your email for OTP');
            }
        } catch (e) {
            console.log('Send OTP Error: ' + e);
        }
    };

    handleCheckOTP = async (values) => {
        const { otpCode } = values;

        let res = await userService.forgotPasswordVerifyOtp(otpCode.trim(), this.state.email);
        if (res.errCode === 0) {
            this.setState({ isVerify: true });
        } else {
            toast.error(res.message);
        }
    };

    handleResetPassword = async (values) => {
        try {
            let { email, password, rePassword } = this.state;
            // let { otp, email, anewpassword, passwordRetrieval } = values;
            let newData = {
                email: email.trim(),
                anewpassword: password.trim(),
                passwordRetrieval: rePassword.trim(),
                otp: '',
            };
            let response = await userService.forgotPasswordResetPassword(newData);
            if (response && response.errCode === 0) {
                this.props.navigate(path.LOGIN);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    handleToggleShowPass = (type) => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
        // if (type === 'password') {
        // }
    };

    handleBack = () => {
        this.props.navigate(path.LOGIN);
    };

    render() {
        const { isSendEmail, isVerify, isShowPassword } = this.state;
        return (
            <div className="login-background">
                <div className="back-btn" onClick={() => this.handleBack()}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </div>
                <div className="login-container w-register">
                    {!isSendEmail ? (
                        <div className="row g-0 login-content">
                            <FormikForm
                                formTitle="auth.forgot-your-password"
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
                                ]}
                                handleChange={this.handleInputChange}
                                onSubmit={this.handleSendOTP}
                                buttonTitle="auth.send-otp"
                            />
                        </div>
                    ) : !isVerify ? (
                        <div className="row g-0 login-content otp-form">
                            <FormikForm
                                formTitle="auth.auth"
                                formFields={[
                                    {
                                        name: 'otpCode',
                                        type: 'text',
                                        icon: 'fa-regular fa-user icon',
                                        placeholder: 'form.input-otp',
                                    },
                                ]}
                                handleChange={this.handleInputChange}
                                onSubmit={this.handleCheckOTP}
                                buttonTitle="auth.auth"
                            />
                        </div>
                    ) : (
                        <div className="row g-0 login-content">
                            <FormikForm
                                formTitle="auth.reset-password"
                                formFields={[
                                    {
                                        name: 'password',
                                        type: isShowPassword ? 'text' : 'password',
                                        placeholder: 'form.new-password',
                                        icon: isShowPassword
                                            ? 'fa-regular fa-eye icon'
                                            : 'fa-regular fa-eye-slash icon',
                                    },
                                    {
                                        name: 'rePassword',
                                        type: isShowPassword ? 'text' : 'password',
                                        placeholder: 'form.re-password',
                                        icon: isShowPassword
                                            ? 'fa-regular fa-eye icon'
                                            : 'fa-regular fa-eye-slash icon',
                                    },
                                ]}
                                handleChange={this.handleInputChange}
                                onSubmit={this.handleRegister}
                                isShowPassword={isShowPassword}
                                togglePasswordVisibility={this.handleToggleShowPass}
                                buttonTitle="auth.confirm"
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
