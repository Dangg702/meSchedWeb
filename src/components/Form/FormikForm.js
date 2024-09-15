import React from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { path } from '~/utils';
const MyForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    formTitle,
    formFields,
    onSubmit,
    togglePasswordVisibility,
    buttonTitle,
    intl,
}) => (
    <div>
        <div className="col-sm-12 text-center title">
            <FormattedMessage id={formTitle} />
        </div>
        <Form>
            {formFields.map((field) => (
                <div key={field.name} className="mb-3">
                    <div className="col-sm-12 form-group">
                        {field.type === 'select' ? (
                            <div className="col-sm-12 form-group">
                                <select
                                    className="form-control form-select"
                                    name={field.name}
                                    value={values[field.name]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={field.placeholder}
                                >
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <Field
                                    className="form-control"
                                    type={field.type}
                                    name={field.name}
                                    placeholder={intl.formatMessage({ id: field.placeholder })}
                                    value={values[field.name]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <i
                                    className={field.icon}
                                    onClick={field.name === 'password' ? togglePasswordVisibility : null}
                                ></i>
                            </>
                        )}
                    </div>
                    {touched[field.name] && errors[field.name] && <div className="text-red">{errors[field.name]}</div>}
                </div>
            ))}
            {formTitle === 'auth.login' && (
                <>
                    <div className="col-sm-12 remember-forgot">
                        <label>
                            <input type="checkbox" />
                            <FormattedMessage id="auth.remember-me" />
                        </label>
                        <Link to={'#'}>
                            <FormattedMessage id="auth.forgot-your-password" />
                        </Link>
                    </div>
                </>
            )}
            {formTitle === 'auth.register' && (
                <div className="col-sm-12 mb-4 text-white">Mã OTP sẽ được gửi đến email này</div>
            )}

            {/* BUTTON */}
            <button type="submit" className="btn login-btn" onClick={handleSubmit}>
                <FormattedMessage id={buttonTitle} />
            </button>
            {/*  */}

            {formTitle === 'auth.login' && (
                <>
                    <div className="col-sm-12 text-center mb-3">
                        <p>
                            <FormattedMessage id="auth.dont-have-an-account" />

                            <Link to={path.REGISTER} className="link-form">
                                <FormattedMessage id="auth.register" />
                            </Link>
                        </p>
                        <p className="mt-3">
                            <FormattedMessage id="auth.or-login-with" />
                            <i className="fa-brands fa-google"></i>
                            <i className="fa-brands fa-facebook "></i>
                        </p>
                    </div>
                </>
            )}
            {formTitle === 'auth.register' && (
                <div className="col-sm-12 text-center mb-3">
                    <p>
                        <FormattedMessage id="auth.already-have-an-account" />
                        <Link to={path.LOGIN} className="link-form">
                            <FormattedMessage id="auth.login" />
                        </Link>
                    </p>
                    <p className="mt-3">
                        <FormattedMessage id="auth.or-login-with" />
                        <i className="fa-brands fa-google"></i>
                        <i className="fa-brands fa-facebook "></i>
                    </p>
                </div>
            )}
            {formTitle === 'auth.auth' && (
                <div className="col-sm-12">
                    <p>
                        <FormattedMessage id="auth.not-receive" />
                    </p>
                    <p>
                        <FormattedMessage id="auth.try-again" />
                    </p>
                </div>
            )}
        </Form>
    </div>
);

const FormikForm = withFormik({
    mapPropsToValues: (props) => {
        const values = {};
        props.formFields.forEach((field) => {
            values[field.name] = field.initialValue || '';
        });
        return values;
    },

    validationSchema: (props) => {
        const schema = {};
        props.formFields.forEach((field) => {
            schema[field.name] = field.validation || Yup.string().required('This field is required');
        });
        return Yup.object().shape(schema);
    },

    handleSubmit: (values, { props }) => {
        if (props.onSubmit) {
            props.onSubmit(values); // Gọi hàm xử lý từ component cha
        }
    },
})(MyForm);

export default injectIntl(FormikForm);
