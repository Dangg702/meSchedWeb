import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

import './ManageSchedule.scss';
import { languages } from '~/utils';
import doctorService from '~/services/doctorService';
import { DatePicker } from '~/components/Input';
import { FormattedDate } from '~/components/Formating';
import { isRequired } from '~/utils/ValidateInput';
import * as actions from '~/store/actions';
import { toast } from 'react-toastify';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        let currentDate = new Date();
        this.state = {
            doctors: [],
            selectedOption: null,
            selectedDate: currentDate.setDate(currentDate.getDate() + 2),
            minDate: new Date().setDate(new Date().getDate() - 1),
            timeRanges: [],
            errs: {
                selectedOption: null,
                selectedDate: null,
                timeRanges: null,
            },
            defaultTimeRanges: [],
        };
    }

    componentDidMount() {
        this.getAllDoctors();
        this.props.fetchScheduleCode();
    }

    componentDidUpdate(prevProps, prevState) {
        let data = this.props.scheduleTime;
        if (prevProps.scheduleTime !== data) {
            if (data && data.length > 0) {
                data = data.map((item) => ({ ...item, isSelected: false }));
            }
            this.setState({
                timeRanges: data,
                defaultTimeRanges: data,
            });
        }
    }

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

    buildInputDataSelect = (inputData) => {
        let { language } = this.props;
        let result = [];
        if (!_.isArray(inputData) || _.isEmpty(inputData)) {
            return result;
        }
        inputData.map((item) => {
            let dataVi = `${item.lastName} ${item.firstName}`;
            let dataEn = `${item.firstName} ${item.lastName}`;
            result.push({
                value: item.id,
                label: language === languages.VI ? dataVi : dataEn,
            });
        });
        return result;
    };

    handleChangeDoctor = async (selectedOption) => {
        this.setState({ selectedOption });
        let res = await doctorService.getDoctorInfoById(selectedOption.value);
        if (res && res.errCode === 0 && res.data) {
            this.setState({ errs: { selectedOption: null } });
        }
    };

    handleChangeDate = (date) => {
        this.setState({ selectedDate: date[0], errs: { selectedDate: null } });
    };

    handleClickTimeRange = (time) => {
        let { timeRanges } = this.state;
        if (timeRanges && timeRanges.length > 0) {
            let cpTime = timeRanges;
            cpTime = cpTime.map((item) => {
                if (item.id === time.id) {
                    return { ...item, isSelected: !item.isSelected };
                }
                return { ...item };
            });
            this.setState({ timeRanges: cpTime, errs: { timeRanges: null } });
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

    handleSubmit = async () => {
        let { selectedOption, selectedDate, timeRanges } = this.state;
        let formattedDate = selectedDate ? moment(selectedDate).format('DD/MM/YYYY') : null;
        // console.log('formattedDate', typeof formattedDate);
        timeRanges = timeRanges.filter((item) => item.isSelected).map((item) => item.keyMap);
        let isValid = this.checkValid(selectedOption, selectedDate, timeRanges, 'all');

        if (!isValid) {
            return;
        } else {
            let result = [];
            timeRanges = timeRanges.map((item) => {
                let obj = {};
                obj.doctorId = selectedOption.value;
                obj.date = formattedDate;
                obj.timeType = item;
                result.push(obj);
            });

            let response = await doctorService.createDoctorSchedule({
                dataArr: result,
                doctorId: selectedOption.value,
                date: formattedDate,
            });
            if (response && response.errCode === 0) {
                this.setState({
                    selectedOption: null,
                    selectedDate: null,
                    timeRanges: this.state.defaultTimeRanges,
                    errs: {
                        selectedOption: null,
                        selectedDate: null,
                        timeRanges: null,
                    },
                });
                toast.success('Create schedule successfully');
            } else toast.error('Create schedule failed');

            console.log('handleSubmit', response);
        }
    };

    handleSubmitKey = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleSubmit();
        }
    };

    render() {
        let { doctors, selectedDate, minDate, timeRanges, errs } = this.state;
        let { language } = this.props;
        let options = this.buildInputDataSelect(doctors);
        return (
            <div className="container schedule-container">
                <div className="schedule-title my-3">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="form-wrapper">
                    <div className="row g-3">
                        <div className="col-sm-12 col-md-6">
                            <label className="lable-input">
                                <FormattedMessage id="manage-schedule.selected-doctor" />
                            </label>
                            <Select
                                className="select-doctor"
                                options={options}
                                value={this.state.selectedOption}
                                onChange={this.handleChangeDoctor}
                                onBlur={() => this.checkValid(this.state.selectedOption, null, null, 'selectedOption')}
                            />
                            <div className={errs || errs.selectedOption ? 'error-message' : ''}>
                                {errs.selectedOption}
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <label className="lable-input">
                                <FormattedMessage id="manage-schedule.selected-date" />
                            </label>
                            <DatePicker
                                onChange={this.handleChangeDate}
                                className="form-control"
                                value={selectedDate}
                                minDate={minDate}
                            />
                            <div className={errs || errs.selectedDate ? 'error-message' : ''}>{errs.selectedDate}</div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-sm-12 time-range-wrapper">
                            {timeRanges &&
                                timeRanges.length > 0 &&
                                timeRanges.map((item, index) => (
                                    <button
                                        key={index}
                                        className={item.isSelected ? 'btn btn-time-range active' : 'btn btn-time-range'}
                                        onClick={() => this.handleClickTimeRange(item)}
                                    >
                                        {language === languages.VI ? item.valueVi : item.valueEn}
                                    </button>
                                ))}
                        </div>
                        <div className={errs || errs.timeRanges ? 'error-message' : ''}>{errs.timeRanges}</div>
                    </div>
                    <button className="btn btn-save" onClick={() => this.handleSubmit()}>
                        <FormattedMessage id="manage-schedule.save" />
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
