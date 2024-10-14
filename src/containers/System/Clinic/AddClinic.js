import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import Lightbox from 'yet-another-react-lightbox';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
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
    FormText,
    FormFeedback,
} from 'reactstrap';
import './AddClinic.scss';
import { languages } from '~/utils';
import doctorService from '~/services/doctorService';
import * as actions from '~/store/actions';
import { toast } from 'react-toastify';
import { adminService } from '~/services';

class AddClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };
    }

    initState = {
        type: '',
        name: '',
        address: '',
        description: '',
        contentMarkdown: '',
        contentHtml: '',
        image: '',
    };

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    // Initialize a markdown parser
    mdParser = new MarkdownIt(/* Markdown-it options */);

    getAllDoctors = async () => {
        try {
            const response = await doctorService.getDoctors();
            if (response && response.errCode === 0) {
                this.setState({
                    doctors: response.doctors,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    checkValid = (selectedOption, selectedDate, timeRanges, fieldToCheck) => {
        let errs = {};

        if (fieldToCheck === 'selectedOption' || fieldToCheck === 'all') {
            if (!selectedOption) {
                errs.selectedOption = 'Please select a doctor';
            }
        }

        if (fieldToCheck === 'selectedDate' || fieldToCheck === 'all') {
            if (!selectedDate) {
                errs.selectedDate = 'Please select a date';
            }
        }

        if (fieldToCheck === 'timeRanges' || fieldToCheck === 'all') {
            if (!timeRanges || timeRanges.length === 0) {
                errs.timeRanges = 'Please select at least one time range';
            }
        }

        this.setState({ errs });
        return _.isEmpty(errs);
    };

    onChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: value,
        });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({ contentHtml: html, contentMarkdown: text });
    };

    handleSubmit = async () => {
        let { type, name, address, description, contentMarkdown, contentHtml, image } = this.state;
        let errs = {};

        // if (!type) {
        //     errs.type = 'Please input clinic type';
        // }

        // if (!name) {
        //     errs.name = 'Please input clinic name';
        // }

        // if (!address) {
        //     errs.address = 'Please input clinic address';
        // }

        // if (!description) {
        //     errs.description = 'Please input clinic description';
        // }

        // if (!image) {
        //     errs.image = 'Please upload clinic image';
        // }

        // if (!contentMarkdown) {
        //     errs.contentMarkdown = 'Please input contentMarkdown';
        // }
        // if (!contentHtml) {
        //     errs.contentHtml = 'Please input contentHtml';
        // }

        // if (_.isEmpty(errs)) {
        try {
            let data = {
                type,
                name,
                address,
                description,
                contentMarkdown,
                contentHtml,
                image,
            };
            console.log('check submit', data);

            const response = await adminService.createClinic(data);
            if (response && response.errCode === 0) {
                toast.success('Create clinic successfully');
                this.setState({
                    ...this.initState,
                });
            } else {
                toast.error('Create clinic failed');
            }
        } catch (error) {
            console.log(error);
        }
        // } else {
        //     this.setState({
        //         errors: errs,
        //     });
        // }
    };

    handleSubmitKey = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleSubmit();
        }
    };

    render() {
        let { errors, isOpenLightBox } = this.state;
        let { language } = this.props;
        console.log('check clinic', this.state);

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
                                    // invalid={errors.name && errors.name !== '' ? true : false}
                                    // onKeyDown={this.handleEnter}
                                />
                                {/* <FormFeedback>{errors.name === '' ? '' : errors.name}</FormFeedback> */}
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
                                    // invalid={errors.address && errors.address !== '' ? true : false}
                                    // onKeyDown={this.handleEnter}
                                />
                                {/* <FormFeedback>{errors.address === '' ? '' : errors.address}</FormFeedback> */}
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
                                {/* <FormFeedback>{errors.name === '' ? '' : errors.name}</FormFeedback> */}
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
                                {/* <FormFeedback>{errors.name === '' ? '' : errors.name}</FormFeedback> */}
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
                    <button className="btn btn-save-clinic" onClick={this.handleSubmit}>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddClinic);
