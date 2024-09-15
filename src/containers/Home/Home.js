import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Specialty from './Section/Specialty';
import MedicalFacilities from './Section/MedicalFacilities';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About';

import './Home.scss';

class Home extends Component {
    render() {
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
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2,
                    },
                },
                {
                    breakpoint: 530,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
            nextArrow: <CustomNextArrow />,
            prevArrow: <CustomPrevArrow />,
        };
        return (
            <div className="home-container">
                {/* Sections */}
                <Specialty settings={settings} />
                <MedicalFacilities settings={settings} />
                <OutStandingDoctor settings={settings} />
                <HandBook settings={settings} />
                <About />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
