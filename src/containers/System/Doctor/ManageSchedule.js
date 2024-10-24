import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import _, { debounce } from 'lodash';
import moment from 'moment';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';

import './ManageSchedule.scss';
import { languages } from '~/utils';
import doctorService from '~/services/doctorService';
import { DatePicker } from '~/components/Input';
import { FormattedDate } from '~/components/Formating';
import { isRequired } from '~/utils/ValidateInput';
import * as actions from '~/store/actions';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

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
            listSchedule: [],
            perPage: 50,
            page: 1,
            totalSchedule: 0,
            totalPages: 0,
            isConfirmDelModal: false,
            errs: {
                selectedOption: null,
                selectedDate: null,
                timeRanges: null,
            },
            defaultTimeRanges: [],
            deleteData: null,
        };
    }

    componentDidMount() {
        this.getAllDoctors();
        this.props.fetchScheduleCode();
        this.getAllSchedule();
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
        if (prevState.page !== this.state.page) {
            this.getAllSchedule(this.state.page, this.state.perPage);
        }
        if (prevState.totalSchedule !== this.state.totalSchedule) {
            this.getAllSchedule(1, this.state.perPage);
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
        timeRanges = timeRanges.filter((item) => item.isSelected).map((item) => item.keyMap);
        if (this.props.role === 'R2') {
            selectedOption = selectedOption ? selectedOption : { value: this.props.doctorId };
        }
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
            this.props.setLoading(true);
            let response = await doctorService.createDoctorSchedule({
                dataArr: result,
                doctorId: selectedOption ? selectedOption.value : this.props.doctorId,
                date: formattedDate,
            });
            if (response && response.errCode === 0) {
                this.props.setLoading(false);
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
                this.getAllSchedule(this.state.page, this.state.perPage);
            } else {
                this.props.setLoading(false);
                toast.error('Create schedule failed');
            }
        }
    };

    handleSubmitKey = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleSubmit();
        }
    };

    handleSearch = debounce((e) => {
        let term = e.target.value;
        if (term) {
            let cloneListSchedule = _.cloneDeep(this.state.listSchedule);
            cloneListSchedule = cloneListSchedule.filter((item) => item.date.includes(term));
            this.setState({ listSchedule: cloneListSchedule });
            // this.getAllSchedule(term, this.state.page, this.state.perPage);
        } else {
            this.getAllSchedule('ALL', this.state.page, this.state.perPage);
        }
    }, 300);

    toggleModal = (item) => {
        this.setState({ isConfirmDelModal: !this.state.isConfirmDelModal });
        if (item) {
            this.setState({ deleteData: item });
        }
    };

    handleDelete = async (id) => {
        this.props.setLoading(true);
        let response = await doctorService.deleteSchedule(id);
        if (response && response.errCode === 0) {
            this.props.setLoading(false);
            this.toggleModal();
            toast.success('Delete schedule successfully');
            this.setState({ page: 1 });
            this.getAllSchedule(this.state.page, this.state.perPage);
        } else {
            this.props.setLoading(false);
            toast.error('Delete schedule failed');
        }
    };

    getAllSchedule = async () => {
        let res = await doctorService.getAllSchedule('ALL', this.state.page, this.state.perPage);
        if (res && res.errCode === 0) {
            this.setState({ listSchedule: res.data, totalSchedule: res.total, totalPages: res.total_pages });
        }
    };
    // pagination
    handlePageClick = (event) => {
        this.setState({ page: +event.selected + 1 });
    };

    render() {
        let { doctors, selectedDate, minDate, timeRanges, errs, listSchedule, isConfirmDelModal } = this.state;
        let { language } = this.props;
        let options = this.buildInputDataSelect(doctors);

        return (
            <div className="container schedule-container">
                <div className="schedule-title my-3">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="form-wrapper">
                    <div className="row g-3">
                        {this.props.role && this.props.role === 'R2' ? null : (
                            <div className="col-sm-12 col-md-6">
                                <label className="lable-input">
                                    <FormattedMessage id="manage-schedule.selected-doctor" />
                                </label>
                                <Select
                                    className="select-doctor"
                                    options={options}
                                    value={this.state.selectedOption}
                                    onChange={this.handleChangeDoctor}
                                    onBlur={() =>
                                        this.checkValid(this.state.selectedOption, null, null, 'selectedOption')
                                    }
                                />
                                <div className={errs || errs.selectedOption ? 'error-message' : ''}>
                                    {errs.selectedOption}
                                </div>
                            </div>
                        )}

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
                <div className="schedule-title my-3">
                    <FormattedMessage id="manage-schedule.title-info" />
                </div>
                <div className="schedule-info row">
                    <div className="col-sm-12 col-md-6">
                        <FormattedMessage id="manage-schedule.search-placeholder" defaultMessage="search">
                            {(placeholder) => (
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={placeholder}
                                    onInput={(e) => this.handleSearch(e)}
                                />
                            )}
                        </FormattedMessage>
                    </div>

                    <div className="col-12 mt-3 table-manage-schedule">
                        <Table bordered responsive>
                            <thead>
                                <tr className="table-warning">
                                    <th>#</th>
                                    <th>
                                        <FormattedMessage id="manage-schedule.date" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="manage-schedule.time" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="manage-schedule.doctor" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="manage-schedule.actions" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listSchedule && listSchedule.length > 0 ? (
                                    listSchedule.map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row" key={index}>
                                                {index + 1}
                                            </th>
                                            <td>{item.date}</td>
                                            <td>
                                                {language === languages.VI
                                                    ? item.timeData.valueVi
                                                    : item.timeData.valueEn}
                                            </td>
                                            <td>
                                                {language === languages.VI
                                                    ? `${item.doctorData.lastName} ${item.doctorData.firstName}`
                                                    : `${item.doctorData.firstName} ${item.doctorData.lastName}`}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger ms-2"
                                                    onClick={() => this.toggleModal(item.id)}
                                                >
                                                    <FormattedMessage id="manage-schedule.delete" />
                                                </button>
                                                <Modal isOpen={isConfirmDelModal} toggle={this.toggleModal}>
                                                    <ModalHeader toggle={this.toggleModal}>Xác nhận xóa</ModalHeader>
                                                    <ModalBody>Bạn có chắc chắn muốn xóa lịch hẹn này không?</ModalBody>
                                                    <ModalFooter>
                                                        <Button
                                                            color="primary"
                                                            onClick={() => this.handleDelete(this.state.deleteData)}
                                                        >
                                                            Xóa
                                                        </Button>{' '}
                                                        <Button color="secondary" onClick={this.toggleModal}>
                                                            Hủy
                                                        </Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            <FormattedMessage id="manage-schedule.no-data" />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Paginate */}
                    <ReactPaginate
                        nextLabel=">>"
                        onPageChange={(e) => this.handlePageClick(e)}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={5}
                        pageCount={this.state.totalPages}
                        previousLabel="<<"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
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
        role: state.user.userInfo.roleId,
        doctorId: state.user.userInfo.id,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchScheduleCode: () => dispatch(actions.fetchScheduleCode()),
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
