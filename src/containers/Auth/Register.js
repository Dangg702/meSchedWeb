import { connect } from 'react-redux';
import { Component } from 'react';
import { push } from 'connected-react-router';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import * as Yup from 'yup';

import { path } from '~/utils';
import * as actions from '../../store/actions';
import { userService } from '../../services';
import FormikForm from '~/components/Form/FormikForm';

import './Auth.scss';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isSendEmail: false,
            otpCode: '',
            isVerify: false,
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            gender: '',
            isShowPassword: false,
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
            let result = await userService.getOpt(email);
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
        console.log('handleCheckOTP', otpCode);
        let res = await userService.verifyOtpCode(otpCode.trim());
        if (res.errCode === 0) {
            this.setState({ isVerify: true });
        } else {
            toast.error(res.message);
        }
    };

    handleRegister = async (values) => {
        try {
            let { email } = this.state;
            let { password, firstName, lastName, address, phoneNumber, gender } = values;
            let newData = {
                email: email.trim(),
                password: password.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                address: address.trim(),
                phoneNumber: phoneNumber.trim(),
                roleId: 'R3',
                gender: gender,
            };
            let response = await userService.register(newData);
            if (response && response.errCode === 0) {
                this.props.navigate(path.LOGIN);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    handleToggleShowPass = () => {
        this.setState({ isShowPassword: !this.state.isShowPassword });
    };

    handleBackHome = () => {
        this.props.navigate(path.HOME);
    };

    render() {
        const { isSendEmail, isVerify, isShowPassword } = this.state;
        return (
            <div className="login-background">
                <div className="back-btn" onClick={() => this.handleBackHome()}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </div>
                <div className="login-container w-register">
                    {!isSendEmail ? (
                        <div className="row g-0 login-content">
                            <FormikForm
                                formTitle="auth.register"
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
                                buttonTitle="auth.register"
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
                                formTitle="auth.profile"
                                formFields={[
                                    {
                                        name: 'firstName',
                                        type: 'text',
                                        icon: 'fa-regular fa-user icon',
                                        placeholder: 'form.first-name',
                                    },
                                    {
                                        name: 'lastName',
                                        type: 'text',
                                        icon: 'fa-regular fa-user icon',
                                        placeholder: 'form.last-name',
                                    },
                                    {
                                        name: 'password',
                                        type: isShowPassword ? 'text' : 'password',
                                        placeholder: 'form.password',
                                        icon: isShowPassword
                                            ? 'fa-regular fa-eye icon'
                                            : 'fa-regular fa-eye-slash icon',
                                    },
                                    {
                                        name: 'gender',
                                        type: 'select',
                                        placeholder: 'form.gender',
                                        options: [
                                            { value: 'M', label: 'Male' },
                                            { value: 'F', label: 'Female' },
                                        ],
                                    },
                                    {
                                        name: 'address',
                                        type: 'text',
                                        icon: 'fa-solid fa-location-dot icon',
                                        placeholder: 'form.address',
                                    },
                                    {
                                        name: 'phoneNumber',
                                        type: 'text',
                                        icon: 'fa-solid fa-phone-flip icon',
                                        placeholder: 'form.phone-number',
                                    },
                                ]}
                                handleChange={this.handleInputChange}
                                onSubmit={this.handleRegister}
                                isShowPassword={isShowPassword}
                                togglePasswordVisibility={this.handleToggleShowPass}
                                buttonTitle="auth.register"
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
