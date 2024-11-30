import { connect } from 'react-redux';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
    Row,
    FormFeedback,
} from 'reactstrap';
import Lightbox from 'yet-another-react-lightbox';
import { emitter } from '../../../utils/emitter';
import { languages } from '../../../utils/constant';
import * as actions from '../../../store/actions';
import { validateInput } from '../../../utils/ValidateInput';
import './ModalUser.scss';

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            gender: '',
            position: '',
            role: '',
            image: '',

            errors: {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                gender: '',
                position: '',
                role: '',
                image: '',
            },

            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpenLightBox: false,
        };
        // this.listenToEmitter();
    }

    openLightBox = () => {
        this.setState({
            isOpenLightBox: true,
        });
    };

    closeLightBox = () => {
        this.setState({
            isOpenLightBox: false,
        });
    };

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                gender: '',
                position: '',
                role: '',
                image: '',
                previewImgUrl: '',
            });
        });
    }

    async componentDidMount() {
        try {
            const { isEditing, userData } = this.props;
            if (isEditing && userData) {
                const { id, email, firstName, lastName, address, phoneNumber } = userData;
                this.setState({ id, email, firstName, lastName, address, phoneNumber });
            }
            this.props.getGenderStart();
            this.props.getPositionStart();
            this.props.getRoleStart();
            this.listenToEmitter();
        } catch (e) {
            console.log(e);
        }
    }

    // componentWillUnmount() {
    //     emitter.off('EVENT_CLEAR_MODAL_DATA');
    // }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isEditing, userData } = this.props;
        if (isEditing && userData && prevProps.userData !== userData) {
            const { id, email, firstName, lastName, address, phoneNumber, gender, roleId, positionId } = userData;
            this.setState({
                id,
                email,
                firstName,
                lastName,
                address,
                phoneNumber,
                gender,
                role: roleId,
                position: positionId,
            });
        }

        if (prevProps.genders !== this.props.genders) {
            this.setState({ genderArr: this.props.genders, gender: this.props.genders[0].keyMap });
        }
        if (prevProps.positions !== this.props.positions) {
            this.setState({ positionArr: this.props.positions, position: this.props.positions[0].keyMap });
        }
        if (prevProps.roles !== this.props.roles) {
            this.setState({ roleArr: this.props.roles, role: this.props.roles[0].keyMap });
        }
    }

    onChangeInput = (e) => {
        let copyState = { ...this.state };
        copyState[e.target.name] = e.target.value;
        copyState.errors[e.target.name] = '';
        this.setState(copyState);
    };

    validateIn = (inputName) => {
        const { email, password, firstName, lastName, address, phoneNumber, errors } = this.state;
        let state = { email, password, firstName, lastName, address, phoneNumber, errors };
        let errs = validateInput(inputName, state);
        this.setState({ errors: errs });
    };

    handleSubmitForm = () => {
        const { id, email, password, firstName, lastName, address, phoneNumber, gender, role, position, image } =
            this.state;
        const data = new FormData();
        if (!this.props.isEditing) {
            data.append('email', email);
            data.append('password', password);
        }
        data.append('firstName', firstName);
        data.append('lastName', lastName);
        data.append('address', address);
        data.append('phoneNumber', phoneNumber);
        data.append('gender', gender);
        data.append('roleId', role);
        data.append('positionId', position);
        if (image) {
            data.append('image', image);
        }
        if (this.props.isEditing) {
            this.props.handleSubmit(id, data);
        } else {
            let { email, password, firstName, lastName, address, phoneNumber } = this.state;
            if (email && password && firstName && lastName && address && phoneNumber) {
                this.props.handleSubmit(id, data);
            } else {
                this.setState({
                    errors: {
                        email: email ? '' : 'Email is required',
                        password: password ? '' : 'Password is required',
                        firstName: firstName ? '' : 'First name is required',
                        lastName: lastName ? '' : 'Last name is required',
                        address: address ? '' : 'Address is required',
                        phoneNumber: phoneNumber ? '' : 'Phone number is required',
                    },
                });
            }
        }
    };

    handleEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmitForm();
        }
    };

    handleChangeImage = (e) => {
        let file = e.target.files[0];
        if (file) {
            let url = URL.createObjectURL(file);
            this.setState({ previewImgUrl: url, image: file });
        }
    };
    render() {
        let { isEditing, language } = this.props;
        let { genderArr, positionArr, roleArr, isOpenLightBox, errors } = this.state;
        return (
            <Modal
                isOpen={this.props.modal}
                toggle={this.props.toggle}
                size="lg"
                centered
                className={'modal-user-container'}
            >
                <ModalHeader toggle={this.props.toggle}>
                    {this.props.isEditing ? (
                        <FormattedMessage id="manage-user.edit-user" />
                    ) : (
                        <FormattedMessage id="manage-user.create-user" />
                    )}{' '}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="email">
                                        <FormattedMessage id="manage-user.email" />
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="example2gmail.com"
                                        type="email"
                                        value={this.state.email}
                                        onChange={(e) => this.onChangeInput(e)}
                                        disabled={this.props.isEditing ? true : false}
                                        invalid={errors.email && errors.email !== '' ? true : false}
                                        onBlur={() => this.validateIn('email')}
                                    />
                                    <FormFeedback>{errors.email === '' ? '' : errors.email}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="password">
                                        <FormattedMessage id="manage-user.password" />
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="*********"
                                        type="password"
                                        value={this.state.password}
                                        onChange={(e) => this.onChangeInput(e)}
                                        disabled={isEditing ? true : false}
                                        invalid={errors.password && errors.password !== '' ? true : false}
                                        onBlur={(e) => this.validateIn('password')}
                                    />
                                    <FormFeedback>{errors.password === '' ? '' : errors.password}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="lastName">
                                        <FormattedMessage id="manage-user.last-name" />
                                    </Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Phan"
                                        value={this.state.lastName}
                                        onChange={(e) => this.onChangeInput(e)}
                                        onKeyDown={(e) => this.handleEnter(e)}
                                        invalid={errors.lastName && errors.lastName !== '' ? true : false}
                                        onBlur={() => this.validateIn('lastName')}
                                    />
                                    <FormFeedback>{errors.lastName === '' ? '' : errors.lastName}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="firstName">
                                        <FormattedMessage id="manage-user.first-name" />
                                    </Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Minh"
                                        value={this.state.firstName}
                                        onChange={(e) => this.onChangeInput(e)}
                                        onKeyDown={(e) => this.handleEnter(e)}
                                        invalid={errors.firstName && errors.firstName !== '' ? true : false}
                                        onBlur={() => this.validateIn('firstName')}
                                    />
                                    <FormFeedback>{errors.firstName === '' ? '' : errors.firstName}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="phoneNumber">
                                        <FormattedMessage id="manage-user.phone-number" />
                                    </Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="0987659854"
                                        value={this.state.phoneNumber}
                                        onChange={(e) => this.onChangeInput(e)}
                                        onKeyDown={(e) => this.handleEnter(e)}
                                        invalid={errors.lastName && errors.phoneNumber !== '' ? true : false}
                                        onBlur={() => this.validateIn('phoneNumber')}
                                    />
                                    <FormFeedback>{errors.phoneNumber === '' ? '' : errors.phoneNumber}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="address">
                                        <FormattedMessage id="manage-user.address" />
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        placeholder="1234 Main St"
                                        value={this.state.address}
                                        onChange={(e) => this.onChangeInput(e)}
                                        onKeyDown={(e) => this.handleEnter(e)}
                                        invalid={errors.address !== '' ? true : false}
                                        onBlur={() => this.validateIn()}
                                    />
                                    <FormFeedback>{errors.address === '' ? '' : errors.address}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="gender">
                                        <FormattedMessage id="manage-user.gender" />
                                    </Label>
                                    <Input
                                        id="gender"
                                        name="gender"
                                        type="select"
                                        value={this.state.gender}
                                        onChange={(e) => this.onChangeInput(e)}
                                    >
                                        {genderArr &&
                                            genderArr.length > 0 &&
                                            genderArr.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === languages.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="position">
                                        <FormattedMessage id="manage-user.position" />
                                    </Label>
                                    <Input
                                        id="position"
                                        name="position"
                                        type="select"
                                        value={this.state.position}
                                        onChange={(e) => this.onChangeInput(e)}
                                    >
                                        {positionArr &&
                                            positionArr.length > 0 &&
                                            positionArr.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === languages.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="role">
                                        <FormattedMessage id="manage-user.role" />
                                    </Label>
                                    <Input
                                        id="role"
                                        name="role"
                                        type="select"
                                        value={this.state.role}
                                        onChange={(e) => this.onChangeInput(e)}
                                    >
                                        {roleArr &&
                                            roleArr.length > 0 &&
                                            roleArr.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === languages.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                );
                                            })}
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="mb-3 d-flex align-items-center">
                                <FormGroup>
                                    <Label for="image" className="me-2">
                                        <FormattedMessage id="manage-user.image" />
                                    </Label>
                                    <div className="preview-img-container">
                                        <Input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => this.handleChangeImage(e)}
                                        />
                                        <Label className="label-upload" htmlFor="image">
                                            <FormattedMessage id="manage-user.upload" />
                                            <i className="fa-solid fa-cloud-arrow-up ms-2"></i>
                                        </Label>
                                        <div
                                            className="preview-image ms-3"
                                            style={{
                                                background: `url(${this.state.previewImgUrl}) top center/cover no-repeat`,
                                            }}
                                            onClick={() => this.openLightBox()}
                                        ></div>
                                        <Lightbox
                                            open={isOpenLightBox}
                                            close={() => this.closeLightBox()}
                                            slides={[{ src: `${this.state.previewImgUrl}`, width: 640, height: 427 }]}
                                        />
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => this.handleSubmitForm()}>
                        {this.props.isEditing ? (
                            <FormattedMessage id="manage-user.save-changes" />
                        ) : (
                            <FormattedMessage id="manage-user.create-user" />
                        )}
                    </Button>{' '}
                    <Button color="secondary" onClick={this.props.toggle}>
                        <FormattedMessage id="manage-user.cancel" />
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        isLoadingGenders: state.admin.isLoadingGenders,
        positions: state.admin.positions,
        roles: state.admin.roles,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
