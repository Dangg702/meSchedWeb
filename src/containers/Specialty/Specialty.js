import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { path, languages } from '~/utils';
import SearchResult from '~/components/SearchResult';
import { userService } from '~/services';
import './Specialty.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';
import ReactPaginate from 'react-paginate';
import ClinicIntro from '~/components/ClinicIntro/ClinicIntro';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            dataList: [],
            totalPages: 1,
            perPage: 10,
            page: 1,
        };
    }

    componentDidMount() {
        let match = this.props.match;
        console.log('match', match);
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

    //   Paginate
    handlePageClick = (event) => {
        this.setState({ page: +event.selected + 1 });
    };

    getDataList = async (type) => {
        let { page, perPage } = this.state;
        let data = '';
        if (type === 'clinic') {
            data = await userService.getAllClinic('ALL', page, perPage);
        }
        if (type === 'specialty') {
            data = await userService.getSpecialty('ALL', page, perPage);
        }
        if (type === 'doctor') {
            data = await userService.getDoctors('ALL', page, perPage);
        }
        if (data && data.errCode === 0) {
            this.setState({ dataList: data.data, totalPages: data.total_pages });
        }
    };

    render() {
        let { type, dataList } = this.state;
        console.log('dataList', dataList);
        return (
            <>
                <div className="specialty-more-container row g-0 p-3">
                    {/* doctor */}
                    {type === 'doctor' && (
                        <>
                            <div className="col-4">30% có search và chọn chuyên khoa</div>
                            <div className="col-8">{/* continue */}</div>
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
                                <div className="no-data">Không có dữ liệu</div>
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
                                <div className="no-data">Không có dữ liệu</div>
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
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
