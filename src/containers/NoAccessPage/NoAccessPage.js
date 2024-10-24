import { connect } from 'react-redux';
import { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Error403 from '~/assets/images/error-403.png';

import './NoAccessPage.scss';

class NoAccessPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="no-access-container">
                <div className="icon-container">
                    <img src={Error403} alt="No access" className="no-access-icon" />
                </div>
                <h1>
                    <FormattedMessage id="no-access.title" />
                </h1>
                <p>
                    <FormattedMessage id="no-access.sub-title" />
                </p>
                <Link to="/" className="back-home-link">
                    <FormattedMessage id="no-access.btn-back" />
                </Link>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(NoAccessPage);
