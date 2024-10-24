import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfo from './DoctorExtraInfo';
import DoctorIntro from '~/components/DoctorIntro';
import { path, languages } from '~/utils';
import doctorService from '~/services/doctorService';
import './DoctorInfo.scss';
import doctorImg from '~/assets/images/doctor/user-default.jfif';

class DoctorInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorId: -1,
            doctorData: {},
        };
    }

    componentDidMount() {
        let match = this.props.match;
        this.setState({ doctorId: match.params.id });
        if (match && match.params && match.params.id) {
            this.getDoctorInfo(match.params.id);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let id = this.props.match.params.id;
        if (prevProps.match.params.id !== id) {
            this.getDoctorInfo(id);
        }
    }

    getDoctorInfo = async (id) => {
        let doctorData = await doctorService.getDoctorInfoById(id);
        if (doctorData && doctorData.errCode === 0) {
            this.setState({ doctorData: doctorData.data });
        }
    };

    render() {
        let language = this.props.language;
        let { doctorData, doctorId } = this.state;
        let html = doctorData?.markdownData && doctorData?.markdownData?.contentHtml;
        return (
            <>
                <div className="doctor-info-container ">
                    <div className="container breadcrumb-wrapper">
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link to={path.HOME}>Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>Doctor</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                    <div className="doctor-info-wrapper container">
                        <DoctorIntro doctorData={doctorData} className={'doctor-img'} />
                        <div className="doctor-schedule-wrapper pb-4 row g-0">
                            <div className="col-sm-12 col-md-8">
                                <h5 className="ms-3 pt-3 pb-1">Đặt khám nhanh</h5>
                                <DoctorSchedule doctorId={doctorId} />
                            </div>
                            <div className="col-sm-12 col-md-4 separate-line">
                                <DoctorExtraInfo doctorExtraData={doctorData.doctorInfoData} />
                            </div>
                        </div>
                        <div className="doctor-introduce-wrapper py-4" dangerouslySetInnerHTML={{ __html: html }}></div>
                        <div className="doctor-comment-wrapper"></div>
                    </div>
                    <div style={{ height: '30px' }}></div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorInfo);
