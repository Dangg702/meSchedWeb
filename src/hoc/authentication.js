import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login',
});

export const userIsNotAuthenticated = connectedRouterRedirect({
    // Want to redirect the user when they are authenticated
    authenticatedSelector: (state) => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
    allowRedirectBack: false,
});

export const userIsAdmin = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn && state.user.userInfo.roleId === 'R1',
    wrapperDisplayName: 'UserIsAdmin',
    redirectPath: '/no-access',
});

export const userIsNotPatient = connectedRouterRedirect({
    authenticatedSelector: (state) => state.user.isLoggedIn && state.user.userInfo.roleId !== 'R3',
    wrapperDisplayName: 'userIsNotPatient',
    redirectPath: '/no-access', // Trang hiển thị khi người dùng không phải admin
});

export const userHasRole = (requiredRole) =>
    connectedRouterRedirect({
        authenticatedSelector: (state) => state.user.isLoggedIn && state.user.role === requiredRole,
        wrapperDisplayName: `UserHasRole(${requiredRole})`,
        redirectPath: '/no-access', // Trang cho quyền truy cập sai
    });
