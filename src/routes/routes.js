import { path } from '~/utils/constant';

import Home from '~/containers/Home/Home';
import Login from '~/containers/Auth/Login';
import Register from '~/containers/Auth/Register';
import DoctorInfo from '~/containers/Doctor/DoctorInfo';
import Booking from '~/containers/Booking/Booking';
import UserManage from '~/containers/System/Admin/UserManage';
import DoctorManage from '~/containers/System/Admin/DoctorManage';
import ManageSchedule from '~/containers/System/Doctor/ManageSchedule';
import BookingVerify from '~/containers/Booking/BookingVerify';
import SpecialtyManage from '~/containers/System/Specialty/SpecialtyManage';
import SpecialtyDetail from '~/containers/Specialty/SpecialtyDetail';
import AddClinic from '~/containers/System/Clinic/AddClinic';
import ClinicManage from '~/containers/System/Clinic/ClinicManage';
import ClinicDetail from '~/containers/Clinics/ClinicDetail';
import ManageAppointment from '~/containers/System/Doctor/ManageAppointment';
import Specialty from '~/containers/Specialty/Specialty';
import MyFrofile from '~/containers/MyProfile/MyProfile';
import MyAppointment from '~/containers/MyAppointment/MyAppointment';

import { userIsAuthenticated, userIsNotAuthenticated } from '~/hoc/authentication';

import SystemLayout from '~/layouts/SystemLayout';
import HeaderOnlyLayout from '~/layouts/HeaderOnlyLayout';

export const routes = [
    { path: path.LOGIN, component: userIsNotAuthenticated(Login), layout: null },
    { path: path.REGISTER, component: userIsNotAuthenticated(Register), layout: null },

    // system
    { path: path.SYSTEM_USER_MANAGE, component: userIsAuthenticated(UserManage), layout: SystemLayout },
    { path: path.SYSTEM_DOCTOR_MANAGE, component: userIsAuthenticated(DoctorManage), layout: SystemLayout },
    { path: path.SYSTEM_DOCTOR_SCHEDULE_MANAGE, component: userIsAuthenticated(ManageSchedule), layout: SystemLayout },
    { path: path.SYSTEM_SPECIALTY_MANAGE, component: userIsAuthenticated(SpecialtyManage), layout: SystemLayout },
    { path: path.SYSTEM_ADD_CLINIC, component: userIsAuthenticated(AddClinic), layout: SystemLayout },
    { path: path.SYSTEM_CLINIC_MANAGE, component: userIsAuthenticated(ClinicManage), layout: SystemLayout },
    {
        path: path.SYSTEM_DOCTOR_APPOINTMENT_MANAGE,
        component: userIsAuthenticated(ManageAppointment),
        layout: SystemLayout,
    },

    // home
    { path: path.DOCTOR_INFO, component: DoctorInfo },
    { path: path.SPECIALTY_DETAIL, component: SpecialtyDetail },
    { path: path.CLINIC_DETAIL, component: ClinicDetail },
    { path: path.BOOKING, component: userIsAuthenticated(Booking) },
    { path: path.BOOKING_VERIFY, component: userIsAuthenticated(BookingVerify), layout: HeaderOnlyLayout },
    { path: path.SPECIALTY_ALL, component: Specialty },
    { path: path.MY_PROFILE, component: userIsAuthenticated(MyFrofile) },
    { path: path.MY_APPOINTMENT, component: userIsAuthenticated(MyAppointment) },

    { path: path.Home, component: Home, exact: true },
];
