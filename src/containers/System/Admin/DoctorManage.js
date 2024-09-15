import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _ from 'lodash';
import { debounce } from 'lodash';
import { CSVLink } from 'react-csv';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Input } from 'reactstrap';

import * as actions from '~/store/actions';
import { validateInput } from '~/utils/ValidateInput';
import doctorService from '../../../services/doctorService';
import { languages } from '../../../utils';
import './DoctorManage.scss';

class DoctorManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHtml: '',
            hadData: false,
            description: '',
            doctors: [],
            selectedDoctor: null,
            listDoctor: [],

            listPrice: [],
            listPayment: [],
            listCity: [],
            selectedPrice: null,
            selectedPayment: null,
            selectedCity: null,
            nameClinic: '',
            addressClinic: '',
            note: '',

            codeForDoctorInfo: {},

            errors: {
                email: '',
            },
        };
    }

    initState = {
        contentHtml: '',
        contentMarkdown: '',
        description: '',
        hadData: false,
        nameClinic: '',
        addressClinic: '',
        note: '',
        selectedPrice: null,
        selectedPayment: null,
        selectedCity: null,
    };

    async componentDidMount() {
        this.props.getCodeForDoctorInfo();
        let doctors = await this.getAllDoctors();
        let { priceData, paymentData, cityData } = this.props.codeForDoctorInfo;

        let optionsPrice = this.buildInputDataSelect(priceData);
        let optionsPayment = this.buildInputDataSelect(paymentData);
        let optionsCity = this.buildInputDataSelect(cityData);
        let options = this.buildInputDataSelect(doctors);

        this.setState({
            listPrice: optionsPrice,
            listPayment: optionsPayment,
            listCity: optionsCity,
            listDoctor: options,
            doctors: doctors,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            let { priceData, paymentData, cityData } = this.props.codeForDoctorInfo;
            let options = this.buildInputDataSelect(this.state.doctors);
            let optionsPrice = this.buildInputDataSelect(priceData);
            let optionsPayment = this.buildInputDataSelect(paymentData);
            let optionsCity = this.buildInputDataSelect(cityData);
            this.setState({
                listDoctor: options,
                listPrice: optionsPrice,
                listPayment: optionsPayment,
                listCity: optionsCity,
            });
        }
        if (prevProps.codeForDoctorInfo !== this.props.codeForDoctorInfo) {
            let { priceData, paymentData, cityData } = this.props.codeForDoctorInfo;
            let optionsPrice = this.buildInputDataSelect(priceData);
            let optionsPayment = this.buildInputDataSelect(paymentData);
            let optionsCity = this.buildInputDataSelect(cityData);

            this.setState({
                listPrice: optionsPrice,
                listPayment: optionsPayment,
                listCity: optionsCity,
            });
        }
    }

    getAllDoctors = async () => {
        try {
            const response = await doctorService.getDoctors();
            if (response && response.errCode === 0) {
                return response.doctors;
            }
        } catch (error) {
            console.log(error);
        }
    };

    buildInputDataSelect = (inputData) => {
        let { language } = this.props;
        let result = [];
        if (!_.isArray(inputData) || _.isEmpty(inputData)) {
            return result;
        }
        inputData.map((item) => {
            let dataVi = item.hasOwnProperty('firstName') ? `${item.lastName} ${item.firstName}` : item.valueVi;
            let dataEn = item.hasOwnProperty('firstName') ? `${item.firstName} ${item.lastName}` : item.valueEn;
            let value = item.hasOwnProperty('firstName') ? item.id : item.keyMap;

            result.push({
                value: value,
                label: language === languages.VI ? dataVi : dataEn,
            });
        });
        return result;
    };

    // Initialize a markdown parser
    mdParser = new MarkdownIt(/* Markdown-it options */);

    // Finish!
    handleEditorChange = ({ html, text }) => {
        this.setState({ contentHtml: html, contentMarkdown: text });
    };

    handleSubmitMarkdown = async () => {
        let {
            contentMarkdown,
            contentHtml,
            description,
            selectedDoctor,
            hadData,
            selectedPrice,
            selectedPayment,
            selectedCity,
            nameClinic,
            addressClinic,
            note,
        } = this.state;
        let data = {
            contentMarkdown,
            contentHtml,
            description,
            selectedDoctor,
            action: hadData ? 'edit' : 'create',
            selectedPrice: selectedPrice.value,
            selectedPayment: selectedPayment.value,
            selectedCity: selectedCity.value,
            nameClinic,
            addressClinic,
            note,
        };
        let response = await doctorService.postInfoDoctor(data);
        if (response && response.errCode === 0) {
            toast.success(response.message);
            this.setState({
                ...this.initState,
            });
        } else {
            toast.error(response.message);
        }
    };

    handleChangeText = (event, id) => {
        let cpState = { ...this.state };
        cpState[id] = event.target.value;
        this.setState({ ...cpState });
    };

    findItem = (arr, id) => {
        return arr.find((item) => item && item.value === id);
    };

    handleChangeSelect = async (valueObj, selectedName) => {
        let { language } = this.props;
        let { listPayment, listPrice, listCity } = this.state;
        let name = selectedName.name;
        let cpState = { ...this.state };
        cpState[name] = valueObj;

        this.setState({ ...cpState });

        if (name === 'selectedDoctor') {
            let res = await doctorService.getDoctorInfoById(valueObj.value);
            if (
                res &&
                res.errCode === 0 &&
                res.data &&
                res.data.markdownData &&
                res.data.markdownData.contentMarkdown
            ) {
                let markdownData = res.data.markdownData;
                let selectedPrice = '',
                    selectedPayment = '',
                    selectedCity = '',
                    nameClinic = '',
                    addressClinic = '',
                    note = '';
                let doctorInfoData = res.data.doctorInfoData;
                if (res.data.doctorInfoData) {
                    selectedPrice = this.findItem(listPrice, doctorInfoData.priceId);
                    selectedPayment = this.findItem(listPayment, doctorInfoData.paymentId);
                    selectedCity = this.findItem(listCity, doctorInfoData.provinceId);
                    nameClinic = doctorInfoData.nameClinic;
                    addressClinic = doctorInfoData.addressClinic;
                    note = doctorInfoData.note;
                }

                this.setState({
                    contentHtml: markdownData.contentHtml,
                    contentMarkdown: markdownData.contentMarkdown,
                    description: markdownData.description,
                    hadData: true,
                    selectedPrice: selectedPrice,
                    selectedPayment: selectedPayment,
                    selectedCity: selectedCity,
                    nameClinic: nameClinic,
                    addressClinic: addressClinic,
                    note: note,
                });
            } else {
                this.setState({
                    ...this.initState,
                });
            }
        }
    };

    render() {
        let {
            selectedDoctor,
            selectedPrice,
            selectedPayment,
            selectedCity,
            listDoctor,
            listPrice,
            listPayment,
            listCity,
        } = this.state;

        return (
            <div className="manage-doctor-container container-fluid">
                <h2 className="manage-doctor-title text-center mb-3">
                    <FormattedMessage id="manage-doctor.create-doctor" />
                </h2>
                <div className="row mb-3">
                    <div className="col-sm-12 col-md-4">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.selected-doctor" />
                        </label>
                        <Select
                            className="select-doctor"
                            name={'selectedDoctor'}
                            placeholder={<FormattedMessage id="manage-doctor.select" />}
                            options={listDoctor}
                            value={selectedDoctor}
                            onChange={this.handleChangeSelect}
                        />
                    </div>
                    <div className="col-sm-12 col-md-8">
                        <div className="form-floating">
                            <div className="lable-input">
                                <FormattedMessage id="manage-doctor.description" />
                            </div>
                            <textarea
                                className="form-control"
                                style={{ height: '100px' }}
                                value={this.state.description}
                                onChange={(e) => this.handleChangeText(e, 'description')}
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-sm-12 col-md-4">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.price" />
                        </label>
                        <Select
                            className="select-doctor"
                            name={'selectedPrice'}
                            placeholder={<FormattedMessage id="manage-doctor.select" />}
                            options={listPrice}
                            value={selectedPrice}
                            onChange={this.handleChangeSelect}
                        />
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.payment-method" />
                        </label>
                        <Select
                            className="select-doctor"
                            name={'selectedPayment'}
                            placeholder={<FormattedMessage id="manage-doctor.select" />}
                            options={listPayment}
                            value={selectedPayment}
                            onChange={this.handleChangeSelect}
                        />
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.city" />
                        </label>
                        <Select
                            className="select-doctor"
                            name={'selectedCity'}
                            placeholder={<FormattedMessage id="manage-doctor.select" />}
                            options={listCity}
                            value={selectedCity}
                            onChange={this.handleChangeSelect}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-sm-12 col-md-4">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.clinic-name" />
                        </label>
                        <Input
                            id="nameClinic"
                            name="nameClinic"
                            value={this.state.nameClinic}
                            // onBlur={(e) => this.validateIn('password')}
                            onChange={(e) => this.handleChangeText(e, 'nameClinic')}
                        />
                        {/* <FormFeedback>{errors.password === '' ? '' : errors.password}</FormFeedback> */}
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.address" />
                        </label>
                        <Input
                            id="addressClinic"
                            name="addressClinic"
                            value={this.state.addressClinic}
                            onChange={(e) => this.handleChangeText(e, 'addressClinic')}
                        />
                        {/* <FormFeedback>{errors.password === '' ? '' : errors.password}</FormFeedback> */}
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.notes" />
                        </label>
                        <Input
                            id="note"
                            name="note"
                            value={this.state.note}
                            onChange={(e) => this.handleChangeText(e, 'note')}
                        />
                        {/* <FormFeedback>{errors.password === '' ? '' : errors.password}</FormFeedback> */}
                    </div>
                </div>

                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={(text) => this.mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <div className="btn-block">
                    <button className="btn btn-save-doctor" onClick={() => this.handleSubmitMarkdown()}>
                        <FormattedMessage id="manage-doctor.save" />
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        codeForDoctorInfo: state.admin.codeForDoctorInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCodeForDoctorInfo: () => dispatch(actions.fetchCodeForDoctorInfo()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
