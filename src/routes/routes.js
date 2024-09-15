import { path } from '~/utils/constant';

import Home from '~/containers/Home/Home';
import Login from '~/containers/Auth/Login';
import Register from '~/containers/Auth/Register';
import DoctorInfo from '~/containers/Doctor/DoctorInfo';
import Booking from '~/containers/Booking/Booking';
import UserManage from '~/containers/System/Admin/UserManage';
import DoctorManage from '~/containers/System/Admin/DoctorManage';
import ManageSchedule from '~/containers/System/Doctor/ManageSchedule';

import { userIsAuthenticated, userIsNotAuthenticated } from '~/hoc/authentication';

import SystemLayout from '~/layouts/SystemLayout';

export const routes = [
    { path: path.LOGIN, component: userIsNotAuthenticated(Login), layout: null },
    { path: path.REGISTER, component: userIsNotAuthenticated(Register), layout: null },

    // system
    { path: path.SYSTEM_USER_MANAGE, component: userIsAuthenticated(UserManage), layout: SystemLayout },
    { path: path.SYSTEM_DOCTOR_MANAGE, component: userIsAuthenticated(DoctorManage), layout: SystemLayout },
    { path: path.SYSTEM_DOCTOR_SCHEDULE_MANAGE, component: userIsAuthenticated(ManageSchedule), layout: SystemLayout },

    // home
    { path: path.DOCTOR_INFO, component: DoctorInfo },
    { path: path.BOOKING, component: userIsAuthenticated(Booking) },

    { path: path.Home, component: Home, exact: true },
];
