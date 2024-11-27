import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import localization from 'moment/locale/vi';
import { Link } from 'react-router-dom';

import { languages, DATE_FORMAT } from '~/utils';
import { userService } from '~/services';
import './DoctorSchedule.scss';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateArr: [],
            scheduleTimeArr: [],
            date: moment(new Date()).format(DATE_FORMAT.SEND_TO_SERVER),
            currentTime: new Date().getHours(),
        };
    }

    async componentDidMount() {
        let dateArr = this.generateDateArr();
        if (dateArr && dateArr.length > 0) {
            this.setState({ dateArr });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            let dateArr = this.generateDateArr();
            this.setState({ dateArr });
        }
        if (prevProps.doctorId !== this.props.doctorId) {
            this.getScheduleTime(this.props.doctorId, this.state.date);
        }
    }

    generateDateArr() {
        const { language } = this.props;
        let dateArr = [];
        if (language === languages.EN) {
            for (let i = 0; i < 7; i++) {
                let obj = {};
                obj.lable = moment(new Date()).add(i, 'days').locale('en').format('ddd, MM/DD');
                obj.value = moment(new Date()).add(i, 'days').locale('en').format(DATE_FORMAT.SEND_TO_SERVER);
                dateArr.push(obj);
            }
        } else if (language === languages.VI) {
            for (let i = 0; i < 12; i++) {
                let obj = {};
                obj.lable = moment(new Date()).add(i, 'days').format('dddd, DD/MM');
                obj.value = moment(new Date()).add(i, 'days').format(DATE_FORMAT.SEND_TO_SERVER);
                dateArr.push(obj);
            }
        }
        return dateArr;
    }

    handleDateClick(event) {
        let { doctorId } = this.props;
        let date = event.target.getAttribute('value');
        this.setState({ date });
        this.getScheduleTime(doctorId, date);
    }

    async getScheduleTime(doctorId, date) {
        let scheduleTime = await userService.getDoctorSchedule(doctorId, date);
        if (scheduleTime) {
            this.setState({
                scheduleTimeArr: scheduleTime.data,
            });
        }
    }

    handleClickTimeRange = (time) => {
        let timeRanges = this.state.scheduleTimeArr;
        if (timeRanges && timeRanges.length > 0) {
            let cpTime = timeRanges;
            cpTime = cpTime.map((item) => {
                if (item.timeType === time.timeType) {
                    return { ...item, isSelected: !item.isSelected };
                }
                return { ...item };
            });
            this.setState({ scheduleTimeArr: cpTime });
        }
    };

    render() {
        const { dateArr, scheduleTimeArr, date } = this.state;
        const { language } = this.props;

        const CustomNextArrow = (props) => {
            const { className, style, onClick } = props;
            return (
                <div className="slick-arrow-next" style={{ display: 'flex', position: 'absolute' }} onClick={onClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                        preserveAspectRatio="none"
                        width="12"
                        height="24"
                        fill="#34929E"
                    >
                        <path d="m89.45 87.5 143.1 152a23.94 23.94 0 0 1 6.562 16.5 23.96 23.96 0 0 1-6.562 16.5l-143.1 152c-9.12 9.6-24.31 10-33.93.9-9.688-9.125-10.03-24.38-.937-33.94l128.4-135.5-128.4-135.5c-9.093-9.56-8.753-24.71.937-33.9 9.62-9.09 24.81-8.69 33.93.94"></path>
                    </svg>
                </div>
            );
        };

        const CustomPrevArrow = (props) => {
            const { className, style, onClick } = props;
            return (
                <div className="slick-arrow-prev" style={{ display: 'flex' }} onClick={onClick}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 512"
                        preserveAspectRatio="none"
                        width="12"
                        height="24"
                        fill="#34929E"
                    >
                        <path d="m166.5 424.5-143.1-152a23.94 23.94 0 0 1-6.562-16.5 23.94 23.94 0 0 1 6.562-16.5l143.1-152c9.125-9.625 24.31-10.03 33.93-.937 9.688 9.124 10.03 24.38.938 33.94l-128.4 135.5 128.4 135.5c9.094 9.562 8.75 24.75-.938 33.94-9.53 9.057-24.73 8.657-33.93-.943"></path>
                    </svg>
                </div>
            );
        };

        let settings = {
            dots: false,
            draggable: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true,
                    },
                },
                {
                    breakpoint: 765,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        initialSlide: 3,
                    },
                },
                {
                    breakpoint: 530,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    },
                },
            ],
            nextArrow: <CustomNextArrow />,
            prevArrow: <CustomPrevArrow />,
        };
        return (
            <div className="schedule-container">
                <div className="schedule-list-wrapper">
                    <Slider {...settings}>
                        {dateArr &&
                            dateArr.length > 0 &&
                            dateArr.map((item, index) => (
                                <div
                                    className={
                                        item.value === date ? 'schedule-item-wrapper active' : 'schedule-item-wrapper'
                                    }
                                    key={index}
                                >
                                    <div
                                        className="text-description"
                                        value={item.value}
                                        onClick={(e) => this.handleDateClick(e)}
                                    >
                                        {item.lable}
                                    </div>
                                </div>
                            ))}
                    </Slider>
                </div>
                <div className="time-range-container ">
                    <div className="time-range-title">
                        <i className="fa-regular fa-calendar-days me-2"></i>
                        <span className="schedule-title">
                            <FormattedMessage id="doctor.medical-examination-schedule" />
                        </span>
                    </div>
                    <div className="time-range-content">
                        {scheduleTimeArr && scheduleTimeArr.length > 0 ? (
                            scheduleTimeArr.map((item, index) => (
                                <Link
                                    to={`/booking/${item.doctorId}?date=${item.date}&time=${item.timeType}`}
                                    key={index}
                                >
                                    <button
                                        className={
                                            item?.isSelected ? 'btn btn-time-range active' : 'btn btn-time-range'
                                        }
                                    >
                                        {language === languages.VI ? item.timeData.valueVi : item.timeData.valueEn}
                                    </button>
                                </Link>
                            ))
                        ) : (
                            <div>
                                <FormattedMessage id="doctor.no-schedule" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
