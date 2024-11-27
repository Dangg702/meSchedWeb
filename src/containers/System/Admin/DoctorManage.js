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
import { userService } from '~/services';

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

            specialties: [],
            clinics: [],
            listPrice: [],
            listPayment: [],
            listCity: [],
            listClinic: [],
            listSpecialty: [],
            selectedPrice: null,
            selectedPayment: null,
            selectedCity: null,
            selectedClinic: null,
            selectedSpecialty: null,
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',

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
        selectedSpecialty: null,
        selectedDoctor: null,
        selectedClinic: null,
    };

    async componentDidMount() {
        this.props.getCodeForDoctorInfo();
        let doctors = await this.getAllDoctors();
        let specialtyData = await this.getAllSpecialty();
        let clinicData = await this.getAllClinic();
        let { priceData, paymentData, cityData } = this.props.codeForDoctorInfo;

        let optionsPrice = this.buildInputDataSelect(priceData);
        let optionsPayment = this.buildInputDataSelect(paymentData);
        let optionsCity = this.buildInputDataSelect(cityData);
        let options = this.buildInputDataSelect(doctors);
        let optionSpecialty = this.buildInputDataSelect(specialtyData);
        let optionClinic = this.buildInputDataSelect(clinicData);

        this.setState({
            listPrice: optionsPrice,
            listPayment: optionsPayment,
            listCity: optionsCity,
            listDoctor: options,
            doctors: doctors,
            listSpecialty: optionSpecialty,
            specialties: specialtyData,
            listClinic: optionClinic,
            clinics: clinicData,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            let { priceData, paymentData, cityData } = this.props.codeForDoctorInfo;
            let options = this.buildInputDataSelect(this.state.doctors);
            let optionsPrice = this.buildInputDataSelect(priceData);
            let optionsPayment = this.buildInputDataSelect(paymentData);
            let optionsCity = this.buildInputDataSelect(cityData);
            let optionSpecialty = this.buildInputDataSelect(this.state.specialties);
            let optionClinic = this.buildInputDataSelect(this.state.clinics);
            this.setState({
                listDoctor: options,
                listPrice: optionsPrice,
                listPayment: optionsPayment,
                listCity: optionsCity,
                listSpecialty: optionSpecialty,
                listClinic: optionClinic,
                // selectedSpecialty: null,
                // selectedDoctor: null,
                // selectedPrice: null,
                // selectedPayment: null,
                // selectedCity: null,
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
    getAllSpecialty = async () => {
        try {
            const response = await userService.getSpecialty('ALL', null, null);
            if (response && response.errCode === 0) {
                return response.data;
            }
        } catch (error) {
            console.log(error);
        }
    };
    getAllClinic = async () => {
        try {
            const response = await userService.getClinics();
            if (response && response.errCode === 0) {
                return response.data;
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
            let dataVi = item.hasOwnProperty('firstName')
                ? `${item.lastName} ${item.firstName}`
                : item.valueVi
                ? item.valueVi
                : item.name;
            let dataEn = item.hasOwnProperty('firstName')
                ? `${item.firstName} ${item.lastName}`
                : item.valueEn
                ? item.valueEn
                : item.name;
            let value = item.hasOwnProperty('firstName') ? item.id : item.keyMap ? item.keyMap : item.id;

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
            selectedSpecialty,
            selectedClinic,
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
            selectedSpecialty: selectedSpecialty.value ? selectedSpecialty.value : '',
            selectedClinic: selectedClinic.value ? selectedClinic.value : '',
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
        let { listPayment, listPrice, listCity, listSpecialty, listClinic } = this.state;
        let name = selectedName.name;
        let cpState = { ...this.state };
        cpState[name] = valueObj;

        this.setState({ ...cpState });
        console.log(valueObj, selectedName);
        console.log(cpState);

        if (name === 'selectedDoctor') {
            let res = await doctorService.getDoctorInfoById(valueObj.value);
            console.log('getDoctorInfoById', res);

            if (res && res.errCode === 0 && res.data) {
                let markdownData = res.data.markdownData || {};
                let doctorInfoData = res.data.doctorInfoData || {};

                let selectedPrice = this.findItem(listPrice, doctorInfoData.priceId) || '';
                let selectedPayment = this.findItem(listPayment, doctorInfoData.paymentId) || '';
                let selectedCity = this.findItem(listCity, doctorInfoData.provinceId) || '';
                let selectedClinic = this.findItem(listClinic, doctorInfoData.clinicId) || '';
                let selectedSpecialty = this.findItem(listSpecialty, doctorInfoData.specialtyId) || '';
                let note = doctorInfoData.note || '';

                this.setState({
                    contentHtml: markdownData.contentHtml || '',
                    contentMarkdown: markdownData.contentMarkdown || '',
                    description: markdownData.description || '',
                    hadData: !!(markdownData.contentHtml || markdownData.contentMarkdown),
                    selectedPrice: selectedPrice,
                    selectedPayment: selectedPayment,
                    selectedCity: selectedCity,
                    selectedSpecialty: selectedSpecialty,
                    selectedClinic: selectedClinic,
                    note: note,
                });
            } else {
                // Xử lý khi không có dữ liệu hợp lệ
                this.setState({
                    ...this.initState, // Reset state về ban đầu nếu không có dữ liệu hợp lệ
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
            selectedSpecialty,
            selectedClinic,
            listDoctor,
            listPrice,
            listPayment,
            listCity,
            listSpecialty,
            listClinic,
        } = this.state;

        console.log('selectedDoctor', selectedDoctor);

        return (
            <div className="manage-doctor-container container-fluid">
                <h2 className="manage-doctor-title text-center mb-3">
                    <FormattedMessage id="manage-doctor.manage" />
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
                    <div className="col-sm-12 col-md-6">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.selected-specialty" />
                        </label>
                        <Select
                            className="select-doctor"
                            name={'selectedSpecialty'}
                            placeholder={<FormattedMessage id="manage-doctor.select" />}
                            options={listSpecialty}
                            value={selectedSpecialty}
                            onChange={this.handleChangeSelect}
                        />
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.selected-clinic" />
                        </label>
                        <Select
                            className="select-doctor"
                            name={'selectedClinic'}
                            placeholder={<FormattedMessage id="manage-doctor.select" />}
                            options={listClinic}
                            value={selectedClinic}
                            onChange={this.handleChangeSelect}
                        />
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
                    <div className="col-sm-12 col-md-12">
                        <label className="lable-input">
                            <FormattedMessage id="manage-doctor.notes" />
                        </label>
                        <Input
                            id="note"
                            name="note"
                            value={this.state.note}
                            onChange={(e) => this.handleChangeText(e, 'note')}
                        />
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
