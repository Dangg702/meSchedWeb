import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import { debounce } from 'lodash';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import ModalUser from './ModalUser';
import userService from '../../../services/userService';
import { emitter } from '../../../utils/emitter';
import * as actions from '../../../store/actions';
import './UserManage.scss';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            history: [],
            isOpenModal: false,
            isEditing: false,
            userData: null,
            contentOfConfirmModal: {},
            totalUsers: 0,
            totalPages: 0,
            perPage: 6,
            page: 1,
            sortBy: 'asc',
            sortField: 'id',
            dataExport: [],
        };
    }

    async componentDidMount() {
        await this.getAllUsers(this.state.page, this.state.perPage);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this.getAllUsers(this.state.page, this.state.perPage);
        }
        if (prevState.totalUsers !== this.state.totalUsers || prevState.isEditing !== this.state.isEditing) {
            this.getUsers();
        }
    }

    //   Paginate
    handlePageClick = (event) => {
        this.setState({ page: +event.selected + 1 });
    };

    getAllUsers = async (page, perPage) => {
        try {
            const response = await userService.getUsers('ALL', page, perPage);
            if (response && response.errCode === 0) {
                this.setState({
                    users: response.data,
                    totalUsers: response.total,
                    totalPages: response.total_pages,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    getUsers = async () => {
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

    handleCreateUser = () => {
        this.setState({ isOpenModal: !this.state.isOpenModal });
        this.setState({ isEditing: false });
    };

    createNewUser = async (data) => {
        try {
            let { email, password, firstName, lastName, address, phoneNumber, role, gender, position, image } = data;
            let newData = {
                email: email.trim(),
                password: password.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                address: address.trim(),
                phoneNumber: phoneNumber.trim(),
                role,
                gender: gender,
                position: position,
                image: image,
            };
            let response = await userService.createUser(newData);
            if (response && response.errCode === 0) {
                toast.success('Create user succeeded');
                this.getAllUsers(this.state.page, this.state.perPage);
                this.setState({ isOpenModal: false });
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleEditUser = (user) => {
        this.setState({ isOpenModal: !this.state.isOpenModal });
        this.setState({ isEditing: !this.state.isEditing });
        this.setState({ userData: user });
    };

    editUser = async (id, data) => {
        try {
            console.log('edit data', data);
            let response = await userService.editUser(id, data);
            if (response && response.errCode === 0) {
                toast.success('Edit user succeeded');
                this.getAllUsers(this.state.page, this.state.perPage);
                this.setState({ isOpenModal: false });
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    handleSubmitModal = (data) => {
        const { email, password, firstName, lastName, address, phoneNumber, gender, role, position, image } = data;
        // let imageUrl = await
        const createData = {
            email,
            password,
            firstName,
            lastName,
            address,
            phoneNumber,
            gender,
            role,
            position,
            image,
        };
        if (this.state.isEditing) {
            this.editUser(data.id, {
                firstName: firstName && firstName.trim(),
                lastName: lastName && lastName.trim(),
                address: address && address.trim(),
                phoneNumber: phoneNumber && phoneNumber.trim(),
                gender,
                roleId: role,
                positionId: position,
                image: image && image,
            });
        } else {
            this.createNewUser(createData);
        }
    };

    handleDeleteUser = (id) => {
        // this.setState({ isOpenModal: !this.state.isOpenModal });
    };

    deleteUser = async (id) => {
        try {
            let res = await userService.deleteUser(id);
            if (res && res.errCode === 0) {
                toast.success('Delete user succeeded');
                this.getAllUsers(this.state.page, this.state.perPage);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Sort
    handleSort = (sortBy, sortField) => {
        this.setState({ sortBy: sortBy, sortField: sortField });
        let cloneListUsers = _.cloneDeep(this.state.users);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        this.setState({ users: cloneListUsers });
    };
    // Export CSV
    getUserExport = (event, done) => {
        done();
    };

    handleSearch = debounce((e) => {
        let term = e.target.value;
        if (term) {
            let cloneListUsers = _.cloneDeep(this.state.users);
            cloneListUsers = cloneListUsers.filter((item) => item.email.toLowerCase().includes(term.toLowerCase()));
            this.setState({ users: cloneListUsers });
        } else {
            this.getAllUsers(this.state.page, this.state.perPage);
        }
    }, 300);

    render() {
        console.log(this.state.dataExport);

        return (
            <div className="user-container container-fluid">
                <ModalUser
                    modal={this.state.isOpenModal}
                    toggle={this.handleCreateUser}
                    handleSubmit={this.handleSubmitModal}
                    isEditing={this.state.isEditing}
                    userData={this.state.userData}
                />
                <div className="title text-center">
                    <FormattedMessage id="menu.admin.manage-user" />
                </div>
                <div className="mx-1 mt-5 mb-4">
                    <div className="row g-3">
                        <div className="col-sm-12 col-md-6 order-sm-2 order-md-1">
                            <FormattedMessage id="manage-user.search-placeholder" defaultMessage="search">
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
                                        <FormattedMessage id="manage-user.export-csv" />
                                    </CSVLink>
                                </div>
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-add-user"
                                        onClick={() => this.handleCreateUser()}
                                    >
                                        <i className="fa-solid fa-user-plus me-2"></i>
                                        <FormattedMessage id="manage-user.create-user" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="users-table table-responsive mt-3 mx-1">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr className="table-warning">
                                <th scope="col">
                                    <FormattedMessage id="manage-user.id" />
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
                                    <FormattedMessage id="manage-user.email" />
                                </th>
                                <th scope="col">
                                    <FormattedMessage id="manage-user.first-name" />
                                    <span className="filter-icon">
                                        <i
                                            className="fa-solid fa-arrow-up-long"
                                            onClick={() => this.handleSort('asc', 'firstName')}
                                        ></i>
                                        <i
                                            className="fa-solid fa-arrow-down-long ms-1"
                                            onClick={() => this.handleSort('desc', 'firstName')}
                                        ></i>
                                    </span>
                                </th>
                                <th scope="col">
                                    <FormattedMessage id="manage-user.last-name" />
                                </th>
                                <th scope="col">
                                    <FormattedMessage id="manage-user.address" />
                                </th>
                                <th scope="col">
                                    <FormattedMessage id="manage-user.actions" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.map((user, index) => (
                                <tr key={index}>
                                    <th scope="row">{user.id}</th>
                                    <td>{user.email}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.address}</td>
                                    <td className="d-flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-warning"
                                            onClick={() => this.handleEditUser(user)}
                                        >
                                            <i className="fa-solid fa-user-pen"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => this.deleteUser(user.id)}
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
