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
import * as actions from '../../../store/actions';
import { validateInput } from '../../../utils/ValidateInput';

class ModalCreateSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            nameVi: '',
            nameEn: '',
            image: '',
            errors: {
                nameVi: '',
                nameEn: '',
                image: '',
            },
            previewImgUrl: '',
            isOpenLightBox: false,
        };
        this.listenToEmitter();
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
                nameVi: '',
                nameEn: '',
                image: '',
                previewImgUrl: '',
            });
        });
    }

    async componentDidMount() {
        try {
            const { isEditing, specialtyData } = this.props;
            if (isEditing && specialtyData) {
                const { id, valueVi, valueEn, image, previewImgUrl } = specialtyData;
                this.setState({ id, nameVi: valueVi, nameEn: valueEn, image, previewImgUrl });
            }
        } catch (e) {
            console.log(e);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isEditing, specialtyData } = this.props;
        if (isEditing && specialtyData && prevProps.specialtyData !== specialtyData) {
            const { id, valueVi, valueEn, image, previewImgUrl } = specialtyData;
            this.setState({
                id,
                nameVi: valueVi,
                nameEn: valueEn,
                image,
                previewImgUrl,
            });
        }
        if (prevState.previewImgUrl !== this.state.previewImgUrl || prevState.image !== this.state.image) {
            this.setState({
                previewImgUrl: this.state.previewImgUrl,
            });
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
        const { nameVi, nameEn, image, id } = this.state;
        const data = new FormData();
        data.append('valueVi', nameVi);
        data.append('valueEn', nameEn);
        if (image) {
            data.append('image', image);
        }
        if (this.props.isEditing) {
            this.props.handleSubmit(id, data);
            emitter.emit('EVENT_CLEAR_MODAL_DATA');
        } else {
            if (nameVi && nameEn) {
                this.props.handleSubmit(id, data);
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            } else {
                this.setState({
                    errors: {
                        valueVi: nameVi ? '' : 'Specialty name vi is required',
                        valueEn: nameEn ? '' : 'Specialty name en is required',
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
        let { isOpenLightBox, errors } = this.state;

        return (
            <Modal
                isOpen={this.props.modal}
                toggle={this.props.toggle}
                size="lg"
                centered
                className={'modal-specialty-container'}
            >
                <ModalHeader toggle={this.props.toggle}>
                    {this.props.isEditing ? (
                        <FormattedMessage id="manage-specialty.edit-specialty" />
                    ) : (
                        <FormattedMessage id="manage-specialty.create-specialty" />
                    )}{' '}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        <Row>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="nameVi">
                                        <FormattedMessage id="manage-specialty.name-vi" />
                                    </Label>
                                    <Input
                                        id="nameVi"
                                        name="nameVi"
                                        placeholder="Tim mạch"
                                        type="text"
                                        value={this.state.nameVi}
                                        onChange={(e) => this.onChangeInput(e)}
                                        invalid={errors.nameVi && errors.nameVi !== '' ? true : false}
                                        onBlur={() => this.validateIn('nameVi')}
                                        // onKeyDown={this.handleEnter}
                                    />
                                    <FormFeedback>{errors.nameVi === '' ? '' : errors.nameVi}</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6} className="mb-3">
                                <FormGroup>
                                    <Label for="nameEn">
                                        <FormattedMessage id="manage-specialty.name-en" />
                                    </Label>
                                    <Input
                                        id="nameEn"
                                        name="nameEn"
                                        placeholder="Cardiovascular"
                                        type="text"
                                        value={this.state.nameEn}
                                        onChange={(e) => this.onChangeInput(e)}
                                        invalid={errors.nameEn && errors.nameEn !== '' ? true : false}
                                        onBlur={() => this.validateIn('nameEn')}
                                        // onKeyDown={this.handleEnter}
                                    />
                                    <FormFeedback>{errors.nameEn === '' ? '' : errors.nameEn}</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-3 d-flex align-items-center">
                                <FormGroup>
                                    <Label for="image" className="me-2">
                                        <FormattedMessage id="manage-specialty.upload-specialty" />
                                    </Label>
                                    <div className="preview-img-container">
                                        <Input
                                            id="image"
                                            name="file"
                                            type="file"
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
                            <FormattedMessage id="manage-specialty.save-changes" />
                        ) : (
                            <FormattedMessage id="manage-specialty.save" />
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateSpecialty);
