import React, { Component } from 'react';
import { connect } from 'react-redux';

import { userService } from '~/services';
import './ClinicDetail.scss';
import ClinicIntro from '~/components/ClinicIntro/ClinicIntro';

class ClinicDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinicId: -1,
            clinicData: '',
        };
    }

    async componentDidMount() {
        let { match } = this.props;
        if (match && match.params && match.params.id) {
            try {
                let id = match.params.id;
                let clinicData = await this.getClinicDetail(id);
                this.setState({ clinicData, clinicId: id });
            } catch (e) {
                console.log('error at ClinicDetail componentDidMount', e);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {}

    handleClickNavItem = (item) => {
        this.setState({ activeNavItem: item });
    };

    getClinicDetail = async (id) => {
        let response = await userService.getClinicById(id);
        if (response && response.errCode === 0) {
            return response.data;
        }
    };

    render() {
        let { clinicData } = this.state;
        let html = clinicData?.contentHtml;

        return (
            <>
                <div className="clinic-detail-container ">
                    <div className="clinic-detail-header">
                        <ClinicIntro
                            clinicData={clinicData}
                            linkTo={`/book-exam/search?type=clinic&q=${clinicData.name}`}
                            fontSize={'1rem'}
                            fontColor={'#595959'}
                            positionSize={'1.5rem'}
                            buttonRight={true}
                            btnStyle={'btn-booking'}
                        />
                    </div>
                    <div className="clinic-detail-content" dangerouslySetInnerHTML={{ __html: html }}></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClinicDetail);
