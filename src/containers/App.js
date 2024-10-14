import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux';
import { ToastContainer } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

import CustomScrollbars from '../components/CustomScrollbars';
import * as actions from '~/store/actions';

import { routes } from '~/routes/routes';
import DefaultLayout from '~/layouts/DefaultLayout';
import LoadingOverlayComponent from '~/components/LoadingOverlayComponent/LoadingOverlayComponent';

class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
        // this.props.setLoading(false);
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <LoadingOverlayComponent>
                                <CustomScrollbars style={{ width: '100%', height: ' 100vh' }}>
                                    <Switch>
                                        {routes.map((route, index) => {
                                            const Page = route.component;
                                            let Layout = DefaultLayout;

                                            if (route.layout) {
                                                Layout = route.layout;
                                            } else if (route.layout === null) {
                                                Layout = Fragment;
                                            }
                                            return (
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    exact={route.exact}
                                                    render={(props) => (
                                                        <Layout>
                                                            <Page {...props} />
                                                        </Layout>
                                                    )}
                                                />
                                            );
                                        })}
                                    </Switch>
                                </CustomScrollbars>
                            </LoadingOverlayComponent>
                        </div>
                    </div>
                </Router>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
        loading: state.app.loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoading: (isLoading) => dispatch(actions.setLoading(isLoading)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
