import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';

import { path } from '~/utils';

import * as actions from '~/store/actions';
import { adminService } from '~/services';

import './ClinicManage.scss';
import ConfirmModal from '~/components/ConfirmModal';

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
            deleteData: null,
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

    handleSearch = debounce((e) => {
        let term = e.target.value;
        if (term) {
            let cloneListClinic = _.cloneDeep(this.state.listClinic);
            cloneListClinic = cloneListClinic.filter((item) => item.name.includes(term));
            this.setState({ listClinic: cloneListClinic });
        } else {
            this.getAllClinic(this.state.page, this.state.perPage);
        }
    }, 300);

    toggleModal = (item) => {
        this.setState({ isConfirmDelModal: !this.state.isConfirmDelModal });
        if (item) {
            this.setState({ deleteData: item.id });
        }
    };

    handleDelete = async (id) => {
        this.toggleModal();
        let response = await adminService.deleteClinic(id);
        if (response && response.errCode === 0) {
            toast.success('Delete clinic successfully');
            this.setState({ page: 1 });
            this.getAllClinic(this.state.page, this.state.perPage);
        } else {
            toast.error('Delete clinic failed');
        }
    };

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
                                        onInput={(e) => this.handleSearch(e)}
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
                                    <Link to={path.SYSTEM_ADD_CLINIC} type="button" className="btn btn-add-user">
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
                                    <tr key={index}>
                                        <th scope="row" key={index}>
                                            {index + 1}
                                        </th>
                                        <td>{item.name}</td>
                                        <td>{item.address}</td>
                                        <td className="d-flex gap-2">
                                            <Link
                                                to={{
                                                    pathname: path.SYSTEM_ADD_CLINIC,
                                                    state: { clinicData: item }, // Truyền dữ liệu qua state
                                                }}
                                                type="button"
                                                className="btn btn-outline-warning"
                                            >
                                                <i className="fa-solid fa-user-pen"></i>
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => this.toggleModal(item)}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                            <ConfirmModal
                                                isOpen={isConfirmDelModal}
                                                toggle={this.toggleModal}
                                                onDelete={() => this.handleDelete(this.state.deleteData)}
                                                itemName={'Bệnh viện/ Phòng khám'}
                                            />
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
                />
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
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClinicManage);
