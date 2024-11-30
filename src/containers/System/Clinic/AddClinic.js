import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Lightbox from 'yet-another-react-lightbox';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { withRouter } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Col, Row, FormFeedback } from 'reactstrap';

import { emitter } from '~/utils/emitter';
import './AddClinic.scss';
import { path } from '~/utils';
import * as actions from '~/store/actions';
import { toast } from 'react-toastify';
import { adminService } from '~/services';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

class AddClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            type: '',
            name: '',
            address: '',
            description: '',
            contentMarkdown: '',
            contentHtml: '',
            image: '',
            errors: {
                type: '',
                name: '',
                address: '',
                description: '',
                image: '',
            },
            previewImgUrl: '',
            isOpenLightBox: false,
            isEditing: false,
            dataClinic: null,
        };
        this.listenToEmitter();
    }

    initState = {
        type: '',
        name: '',
        address: '',
        description: '',
        contentMarkdown: '',
        contentHtml: '',
        image: '',
        previewImgUrl: '',
    };

    componentDidMount() {
        this.listenToEmitter();
        const clinicData = this.props.location.state?.clinicData;
        if (clinicData) {
            this.setState({
                ...clinicData,
                isEditing: true,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {}

    // componentWillUnmount() {
    //     emitter.off('EVENT_CLEAR_MODAL_DATA');
    // }

    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                ...this.initState,
            });
        });
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

    // Initialize a markdown parser
    mdParser = new MarkdownIt(/* Markdown-it options */);

    onChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({ contentHtml: html, contentMarkdown: text });
    };

    createClinical = async (data) => {
        try {
            this.props.setLoading(true);
            let response = await adminService.createClinic(data);
            if (response && response.errCode === 0) {
                this.props.setLoading(false);
                toast.success('Create clinic succeeded');
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            } else {
                this.props.setLoading(false);
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    updateClinic = async (id, data) => {
        try {
            this.props.setLoading(true);
            let response = await adminService.updateClinic(id, data);
            if (response && response.errCode === 0) {
                this.props.setLoading(false);
                toast.success('Update clinic succeeded');
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            } else {
                this.props.setLoading(false);
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleSubmit = async () => {
        let { id, type, name, address, description, contentMarkdown, contentHtml, image } = this.state;
        try {
            const data = new FormData();
            data.append('type', type);
            data.append('name', name);
            data.append('address', address);
            data.append('description', description);
            data.append('contentMarkdown', contentMarkdown);
            data.append('contentHtml', contentHtml);
            if (image) {
                data.append('image', image);
            }
            if (this.state.isEditing) {
                this.updateClinic(id, data);
            } else {
                if (type && name && address && contentMarkdown && contentHtml) {
                    this.createClinical(data);
                } else {
                    this.setState({
                        errors: {
                            type: type ? '' : 'Type is required',
                            name: name ? '' : 'Name is required',
                            address: address ? '' : 'Address is required',
                            contentMarkdown: contentMarkdown ? '' : 'ContentMarkdown is required',
                            contentHtml: contentHtml ? '' : 'ContentHtml is required',
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleSubmitKey = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleSubmit();
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
        let { errors, isOpenLightBox } = this.state;
        return (
            <div className="container-fluid clinic-container p-4">
                <div className="clinic-title my-3">
                    <FormattedMessage id="manage-clinic.add-clinic-title" />
                </div>
                <Form>
                    <Row>
                        <Col md={6} className="mb-3">
                            <FormGroup>
                                <Label for="speciatyName">
                                    <FormattedMessage id="manage-clinic.name" />
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Bạch Mai"
                                    type="text"
                                    value={this.state.name}
                                    onChange={(e) => this.onChangeInput(e)}
                                    invalid={errors.name && errors.name !== '' ? true : false}
                                    // onKeyDown={this.handleEnter}
                                />
                                <FormFeedback>{errors.name === '' ? '' : errors.name}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6} className="mb-3">
                            <FormGroup>
                                <Label for="speciatyName">
                                    <FormattedMessage id="manage-clinic.address" />
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="79 Đ. Thành Thái, Phường 14, Quận 10, Hồ Chí Minh"
                                    type="text"
                                    value={this.state.address}
                                    onChange={(e) => this.onChangeInput(e)}
                                    invalid={errors.address && errors.address !== '' ? true : false}
                                    // onKeyDown={this.handleEnter}
                                />
                                <FormFeedback>{errors.address === '' ? '' : errors.address}</FormFeedback>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} className="mb-3">
                            <FormGroup>
                                <Label for="type">
                                    <FormattedMessage id="manage-clinic.type" />
                                </Label>
                                <Input id="type" name="type" type="text" onChange={(e) => this.onChangeInput(e)} />
                                <FormFeedback>{errors.name === '' ? '' : errors.name}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6} className="mb-3">
                            <FormGroup>
                                <Label for="description">
                                    <FormattedMessage id="manage-clinic.desc" />
                                </Label>
                                <Input
                                    id="description"
                                    name="description"
                                    type="textarea"
                                    onChange={(e) => this.onChangeInput(e)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={4} className="mb-3 d-flex align-items-center">
                            <FormGroup>
                                <Label for="image" className="me-2">
                                    <FormattedMessage id="manage-clinic.upload-specialty" />
                                </Label>
                                <div className="preview-img-container">
                                    <Input
                                        id="image"
                                        name="image"
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
                <div className="manage-clinic-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={(text) => this.mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <div className="btn-block">
                    <Link to={path.SYSTEM_CLINIC_MANAGE} className="btn btn-back">
                        <FormattedMessage id="manage-specialty.back" />
                    </Link>
                    <button className="btn btn-save-clinic" onClick={() => this.handleSubmit()}>
                        <FormattedMessage id="manage-specialty.save" />
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        scheduleTime: state.admin.scheduleTime,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchScheduleCode: () => dispatch(actions.fetchScheduleCode()),
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddClinic));
