import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import { debounce } from 'lodash';
import { CSVLink } from 'react-csv';

import ModalUser from '../Admin/ModalUser';
import ModalCreateSpecialty from './ModalCreateSpecialty';
import { toast } from 'react-toastify';
import userService from '../../../services/userService';
import { emitter } from '../../../utils/emitter';
import * as actions from '../../../store/actions';
import './SpecialtyManage.scss';
import ConfirmModal from '~/components/ConfirmModal';

class SpecialtyManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],
            isOpenModal: false,
            isEditing: false,
            specialtyData: null,
            contentOfConfirmModal: {},
            totalSpecialty: 0,
            totalPages: 0,
            perPage: 20,
            page: 1,
            sortBy: 'asc',
            sortField: 'id',
            dataExport: [],
            isConfirmDelModal: false,
            deleteData: null,
        };
    }

    async componentDidMount() {
        await this.getAllSpecialty(this.state.page, this.state.perPage);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this.getAllSpecialty(this.state.page, this.state.perPage);
        }
        // if (prevState.totalSpecialty !== this.state.totalSpecialty || prevState.isEditing !== this.state.isEditing) {
        //     this.getUsers();
        // }
    }

    //   Paginate
    handlePageClick = (event) => {
        this.setState({ page: +event.selected + 1 });
    };

    getAllSpecialty = async (page, perPage) => {
        try {
            const response = await userService.getSpecialty('ALL', page, perPage);
            if (response && response.errCode === 0) {
                this.setState({
                    listSpecialty: response.data,
                    totalSpecialty: response.total,
                    totalPages: response.total_pages,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    getSpecialties = async () => {
        try {
            const response = await userService.getUsers('ALL');
            if (response && response.errCode === 0) {
                this.setState({
                    dataExport: response.data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleCreateSpecialty = () => {
        this.setState({ isOpenModal: !this.state.isOpenModal });
        this.setState({ isEditing: false });
        emitter.emit('EVENT_CLEAR_MODAL_DATA');
    };

    createSpecialty = async (data) => {
        try {
            this.props.setLoading(true);
            let response = await userService.createSpecialty(data);
            if (response && response.errCode === 0) {
                this.props.setLoading(false);
                toast.success('Create specialty succeeded');
                this.getAllSpecialty(this.state.page, this.state.perPage);
                this.setState({ isOpenModal: false });
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            } else {
                this.props.setLoading(false);
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleEditSpecialty = (data) => {
        this.setState({ isOpenModal: !this.state.isOpenModal });
        this.setState({ isEditing: !this.state.isEditing });
        if (data.image) {
            data.previewImgUrl = data.image;
        }
        this.setState({ specialtyData: data });
    };

    editSpecialty = async (id, data) => {
        try {
            this.props.setLoading(true);
            let response = await userService.editSpecialty(id, data);
            if (response && response.errCode === 0) {
                this.props.setLoading(false);
                toast.success('Edit specialty succeeded');
                this.getAllSpecialty(this.state.page, this.state.perPage);
                this.setState({ isOpenModal: false });
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            } else {
                this.props.setLoading(false);
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleSubmitModal = (id, data) => {
        if (this.state.isEditing) {
            this.editSpecialty(id, data);
        } else {
            this.createSpecialty(data);
        }
    };

    deleteSpecialty = async (item) => {
        try {
            this.props.setLoading(true);
            let res = await userService.deleteSpecialty(item.id);
            if (res && res.errCode === 0) {
                this.props.setLoading(false);
                toast.success('Delete specialty succeeded');
                this.getAllSpecialty(this.state.page, this.state.perPage);
                this.toggleModal();
            } else {
                this.props.setLoading(false);
                toast.error(res.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    toggleModal = (item) => {
        this.setState({ isConfirmDelModal: !this.state.isConfirmDelModal });
        if (item) {
            this.setState({ deleteData: item });
        }
    };
    // Sort
    handleSort = (sortBy, sortField) => {
        this.setState({ sortBy: sortBy, sortField: sortField });
        let cloneListSpecialty = _.cloneDeep(this.state.listSpecialty);
        cloneListSpecialty = _.orderBy(cloneListSpecialty, [sortField], [sortBy]);
        this.setState({ listSpecialty: cloneListSpecialty });
    };
    // Export CSV
    getUserExport = (event, done) => {
        done();
    };

    handleSearch = debounce((e) => {
        let term = e.target.value;
        if (term) {
            let cloneListSpecialty = _.cloneDeep(this.state.listSpecialty);
            cloneListSpecialty = cloneListSpecialty.filter((item) =>
                item.valueVi.toLowerCase().includes(term.toLowerCase()),
            );
            this.setState({ listSpecialty: cloneListSpecialty });
        } else {
            this.getAllSpecialty(this.state.page, this.state.perPage);
        }
    }, 300);

    render() {
        const { isConfirmDelModal } = this.state;
        return (
            <div className="user-container container-fluid">
                <ModalCreateSpecialty
                    modal={this.state.isOpenModal}
                    toggle={this.handleCreateSpecialty}
                    handleSubmit={this.handleSubmitModal}
                    isEditing={this.state.isEditing}
                    specialtyData={this.state.specialtyData}
                />
                <div className="title text-center">
                    <FormattedMessage id="menu.admin.manage-specialty" />
                </div>
                <div className="mx-1 mt-5 mb-4">
                    <div className="row g-3">
                        <div className="col-sm-12 col-md-6 order-sm-2 order-md-1">
                            <FormattedMessage id="manage-specialty.search-placeholder" defaultMessage="search">
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
                                    <CSVLink
                                        filename={'usersData.csv'}
                                        target="_blank"
                                        data={this.state.dataExport}
                                        className="btn btn-export"
                                        asyncOnClick={true}
                                        // onClick={() => this.getUserExport()}
                                    >
                                        <i className="fa-solid fa-file-export me-2"></i>
                                        <FormattedMessage id="manage-specialty.export-csv" />
                                    </CSVLink>
                                </div>
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-add-user"
                                        onClick={() => this.handleCreateSpecialty()}
                                    >
                                        <i className="fa-solid fa-plus me-2"></i>
                                        <FormattedMessage id="manage-specialty.create-specialty" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="listSpecialty-table table-responsive mt-3 mx-1">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr className="table-warning">
                                <th scope="col">
                                    <FormattedMessage id="manage-specialty.id" />
                                    <span className="filter-icon">
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() => this.handleSort('asc', 'id')}
                                        ></i>
                                        <i
                                            className="fa-solid fa-arrow-down-long ms-1"
                                            onClick={() => this.handleSort('desc', 'id')}
                                        ></i>
                                    </span>
                                </th>
                                <th scope="col">
                                    <FormattedMessage id="manage-specialty.valueVi" />
                                    <span className="filter-icon">
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() => this.handleSort('asc', 'valueVi')}
                                        ></i>
                                        <i
                                            className="fa-solid fa-arrow-down-long ms-1"
                                            onClick={() => this.handleSort('desc', 'valueVi')}
                                        ></i>
                                    </span>
                                </th>
                                <th scope="col">
                                    <FormattedMessage id="manage-specialty.valueEn" />
                                    <span className="filter-icon">
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() => this.handleSort('asc', 'valueEn')}
                                        ></i>
                                        <i
                                            className="fa-solid fa-arrow-down-long ms-1"
                                            onClick={() => this.handleSort('desc', 'valueEn')}
                                        ></i>
                                    </span>
                                </th>
                                <th scope="col">
                                    <FormattedMessage id="manage-specialty.actions" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listSpecialty.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.valueVi}</td>
                                    <td>{item.valueEn}</td>
                                    <td className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-warning"
                                            onClick={() => this.handleEditSpecialty(item)}
                                        >
                                            <i className="fa-solid fa-user-pen"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => this.toggleModal(item)}
                                            // onClick={() => this.deleteSpecialty(item)}
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                        <ConfirmModal
                                            isOpen={isConfirmDelModal}
                                            toggle={this.toggleModal}
                                            onDelete={() => this.deleteSpecialty(this.state.deleteData)}
                                            itemName={`Chuyên khoa ${item.valueVi}`}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        isLoadingGenders: state.admin.isLoadingGenders,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyManage);
