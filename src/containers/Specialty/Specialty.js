import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { path, languages } from '~/utils';
import { userService } from '~/services';
import ReactPaginate from 'react-paginate';
import ClinicIntro from '~/components/ClinicIntro/ClinicIntro';
import DoctorIntro from '~/components/DoctorIntro';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import CustomScrollbars from '~/components/CustomScrollbars';
import { FormattedMessage } from 'react-intl';
import * as actions from '~/store/actions';
import './Specialty.scss';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            dataList: [],
            totalPages: 1,
            perPage: 10,
            page: 1,
            listSpecialtyFull: [],
            listSpecialty: [],
            searchTerm: '',
            selectedSpecialtyId: null,
        };
        this.debounceTimeout = null;
    }

    componentDidMount() {
        let match = this.props.match;
        if (match && match.params && match.params.type) {
            this.setState({ type: match.params.type });
            this.getDataList(match.params.type);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.page !== this.state.page) {
            this.getDataList(this.state.type);
        }
        let match = this.props.match;
        if (match && match.params && match.params.type && prevState.type !== match.params.type) {
            this.setState({ type: match.params.type });
            this.getDataList(match.params.type);
        }
    }

    componentWillUnmount() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
    }

    //   Paginate
    handlePageClick = (event) => {
        this.setState({ page: +event.selected + 1 });
    };

    getDataList = async (type) => {
        let { page, perPage } = this.state;
        let data = '';
        if (type === 'clinic') {
            this.props.setLoading(true);
            data = await userService.getAllClinic('ALL', page, perPage);
        }
        if (type === 'specialty') {
            this.props.setLoading(true);
            data = await userService.getSpecialty('ALL', page, perPage);
        }
        if (type === 'doctor') {
            this.props.setLoading(true);
            data = await userService.getDoctors('ALL', page, perPage);
            let listSpecialty = await userService.getSpecialty('ALL', page, perPage);
            this.setState({ listSpecialty: listSpecialty.data, listSpecialtyFull: listSpecialty.data });
        }
        if (data && data.errCode === 0) {
            this.props.setLoading(false);
            this.setState({ dataList: data.data, totalPages: data.total_pages });
        }
    };

    handleSearchChange = (e) => {
        if (e.target.value === '') {
            this.setState({ listSpecialty: this.state.listSpecialtyFull });
        }
        this.setState({ searchTerm: e.target.value });
        // Xóa timeout cũ nếu có
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            this.filteredSpecialties();
        }, 300);
    };

    filteredSpecialties = () => {
        let { language } = this.props;
        let { searchTerm, listSpecialty } = this.state;

        let res = listSpecialty.filter((item) => {
            const value = language === languages.VI ? item.valueVi : item.valueEn;
            let res = value.toLowerCase().includes(searchTerm.toLowerCase());
            return res;
        });
        this.setState({ listSpecialty: res });
    };

    handleRadioChange = async (value) => {
        this.setState({ selectedSpecialtyId: value });
        let searchRes = await userService.searchDoctorBySpecialty(value);
        this.setState({ dataList: searchRes.data });
    };

    render() {
        let { language } = this.props;
        let { type, dataList, listSpecialty, searchTerm, selectedSpecialtyId } = this.state;
        return (
            <>
                <div className="specialty-more-container row g-0 p-3">
                    {/* doctor */}
                    {type === 'doctor' && (
                        <>
                            <div className="col-md-3 quick-search-specialty">
                                <CustomScrollbars>
                                    <div className="pb-3 px-2">
                                        <div className="fw-bold pe-2 pb-2">
                                            <FormattedMessage id={'homepage.specialty'} />
                                        </div>
                                        <FormattedMessage id="manage-specialty.search" defaultMessage="search">
                                            {(placeholder) => (
                                                <Input
                                                    placeholder={placeholder}
                                                    value={searchTerm}
                                                    onChange={(e) => this.handleSearchChange(e)}
                                                />
                                            )}
                                        </FormattedMessage>
                                    </div>
                                    <Form>
                                        {listSpecialty.length > 0 &&
                                            listSpecialty.map((item, index) => (
                                                <FormGroup className="py-2 ps-2">
                                                    <Input
                                                        type="radio"
                                                        name="specialty"
                                                        checked={selectedSpecialtyId === item.valueVi}
                                                        onChange={() => this.handleRadioChange(item.valueVi)}
                                                    />{' '}
                                                    <Label>
                                                        {language === languages.VI ? item.valueVi : item.valueEn}
                                                    </Label>
                                                </FormGroup>
                                            ))}
                                    </Form>
                                </CustomScrollbars>
                            </div>
                            <div className="col-sm-12 col-md-9">
                                <div className="search-doctors-wrapper">
                                    {dataList &&
                                        dataList.length > 0 &&
                                        dataList.map((item, index) => (
                                            <div key={index} className="search-doctor-item py-3">
                                                <DoctorIntro
                                                    doctorData={item}
                                                    buttonRight={true}
                                                    className={'search-doctor-image'}
                                                    btnStyle={'search-btn-booking'}
                                                    btnFunc={() => this.props.history.push(`/doctor/${item.id}`)}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </>
                    )}
                    {/* clinic */}
                    {type === 'clinic' && (
                        <div className="col-12 clinic-wrapper">
                            {dataList && dataList.length > 0 ? (
                                dataList.map((item, index) => (
                                    <div className="clinic-item pb-4">
                                        <ClinicIntro
                                            key={index}
                                            clinicData={item}
                                            linkTo={`/book-exam/search?type=clinic&q=${item.name}`}
                                            fontSize="14px"
                                            fontColor="#000"
                                            positionSize="16px"
                                            buttonRight={true}
                                            btnStyle={'btn-clinic-booking'}
                                            imageStyle={'clinic-image'}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="no-data">
                                    <FormattedMessage id="all.no-data" />
                                </div>
                            )}
                        </div>
                    )}
                    {/* specialty */}
                    {type === 'specialty' && (
                        <div className="col-12 specialty-wrapper">
                            {dataList && dataList.length > 0 ? (
                                dataList.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={path.SEARCH + `?type=specialty&q=${item.valueVi}`}
                                        className="specialty-item"
                                    >
                                        <img className="specialty-image" src={item.image} alt="..." />
                                        <div className="specialty-name">
                                            {this.props.language === languages.VI ? item.valueVi : item.valueEn}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="no-data">
                                    <FormattedMessage id="all.no-data" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Paginate */}
                {type !== 'specialty' && (
                    <ReactPaginate
                        nextLabel=">"
                        onPageChange={(e) => this.handlePageClick(e)}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={8}
                        pageCount={this.state.totalPages}
                        previousLabel="<"
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
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
