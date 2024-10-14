import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import { debounce } from 'lodash';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';

import { languages, path } from '~/utils';
import doctorService from '~/services/doctorService';
import * as actions from '~/store/actions';
import { adminService } from '~/services';

import './ClinicManage.scss';

class ClinicManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClinic: [],
            totalClinic: 0,
            totalPages: 0,
            perPage: 10,
            page: 1,
            isConfirmDelModal: false,
        };
    }

    componentDidMount() {
        this.getAllClinic(this.state.page, this.state.perPage);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this.getAllClinic(this.state.page, this.state.perPage);
        }
    }

    getAllClinic = async (page, perPage) => {
        try {
            const response = await adminService.getAllClinic('ALL', page, perPage);
            console.log('getAllClinic', response);
            if (response && response.errCode === 0) {
                this.setState({
                    listClinic: response.data,
                    totalClinic: response.total,
                    totalPages: response.total_pages,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    // handleSearch = debounce((e) => {
    //     let term = e.target.value;
    //     if (term) {
    //         let cloneListSchedule = _.cloneDeep(this.state.listSchedule);
    //         cloneListSchedule = cloneListSchedule.filter((item) => item.date.includes(term));
    //         this.setState({ listSchedule: cloneListSchedule });
    //         // this.getAllSchedule(term, this.state.page, this.state.perPage);
    //     } else {
    //         this.getAllSchedule('ALL', this.state.page, this.state.perPage);
    //     }
    // }, 300);

    toggleModal = () => {
        this.setState({ isConfirmDelModal: !this.state.isConfirmDelModal });
    };

    // handleDelete = async (item) => {
    //     console.log(item.id);
    //     this.toggleModal();
    //     let response = await doctorService.deleteSchedule(item.id);
    //     if (response && response.errCode === 0) {
    //         toast.success('Delete schedule successfully');
    //         this.setState({ page: 1 });
    //     } else {
    //         toast.error('Delete schedule failed');
    //     }
    // };

    render() {
        const { listClinic, isConfirmDelModal } = this.state;
        return (
            <div className="container-fluid clinic-manage-container p-4">
                <div className="clinic-manage-title my-3">
                    <FormattedMessage id="manage-clinic.manage" />
                </div>
                <div className="mx-1 mt-5 mb-4">
                    <div className="row g-3">
                        <div className="col-sm-12 col-md-6 order-sm-2 order-md-1">
                            <FormattedMessage id="manage-clinic.search-placeholder" defaultMessage="search">
                                {(placeholder) => (
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={placeholder}
                                        // onInput={(e) => this.handleSearch(e)}
                                    />
                                )}
                            </FormattedMessage>
                        </div>
                        <div className="col-sm-12 col-md-6 order-sm-1 order-md-2 d-flex justify-content-end">
                            <div className="row gx-1">
                                <div className="col">
                                    {/* <CSVLink
                                        filename={'clinicsData.csv'}
                                        target="_blank"
                                        // data={this.state.dataExport}
                                        className="btn btn-export"
                                        asyncOnClick={true}
                                        // onClick={() => this.getUserExport()}
                                    >
                                        <i className="fa-solid fa-file-export me-2"></i>
                                        <FormattedMessage id="manage-user.export-csv" />
                                    </CSVLink> */}
                                </div>
                                <div className="col">
                                    <Link
                                        to={path.SYSTEM_ADD_CLINIC}
                                        type="button"
                                        className="btn btn-add-user"
                                        // onClick={() => this.handleCreateUser()}
                                    >
                                        <i className="fa-solid fa-user-plus me-2"></i>
                                        <FormattedMessage id="manage-clinic.create-specialty" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="users-table table-responsive mt-3 mx-1">
                    <Table bordered responsive>
                        <thead>
                            <tr className="table-warning">
                                <th>#</th>
                                <th>
                                    <FormattedMessage id="manage-clinic.name" />
                                </th>
                                <th>
                                    <FormattedMessage id="manage-clinic.address" />
                                </th>
                                <th>
                                    <FormattedMessage id="manage-clinic.actions" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listClinic && listClinic.length > 0 ? (
                                listClinic.map((item, index) => (
                                    <tr>
                                        <th scope="row" key={index}>
                                            {index + 1}
                                        </th>
                                        <td>{item.name}</td>
                                        <td>{item.address}</td>
                                        <td className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-outline-warning"
                                                // onClick={() => this.handleEditUser(user)}
                                            >
                                                <i className="fa-solid fa-user-pen"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => this.toggleModal()}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <Modal isOpen={isConfirmDelModal} toggle={this.toggleModal}>
                                                <ModalHeader toggle={this.toggleModal}>Xác nhận xóa</ModalHeader>
                                                <ModalBody>
                                                    Sau khi xóa sẽ không thể hoàn tác. Bạn có chắc chắn muốn xóa bệnh
                                                    viện/ phòng khám này không?
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" onClick={() => this.handleDelete(item)}>
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
                {/* <ReactPaginate
                    nextLabel=">>"
                    onPageChange={(e) => this.handlePageClick(e)}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={8}
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
                /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(ClinicManage);
