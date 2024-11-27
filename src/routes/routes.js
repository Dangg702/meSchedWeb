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
import NoAccessPage from '~/containers/NoAccessPage/NoAccessPage';
import SearchResultPage from '~/containers/SearchResultPage/SearchResultPage';

import ChatAI from '~/containers/chatPage/ChatAI';

import { userIsAuthenticated, userIsNotAuthenticated, userIsAdmin, userIsNotPatient } from '~/hoc/authentication';

import SystemLayout from '~/layouts/SystemLayout';
import HeaderOnlyLayout from '~/layouts/HeaderOnlyLayout';

export const routes = [
    { path: path.LOGIN, component: userIsNotAuthenticated(Login), layout: null },
    { path: path.REGISTER, component: userIsNotAuthenticated(Register), layout: null },
    { path: path.NO_ACCESS, component: NoAccessPage, layout: null },

    // system
    { path: path.SYSTEM_USER_MANAGE, component: userIsAuthenticated(userIsAdmin(UserManage)), layout: SystemLayout },
    {
        path: path.SYSTEM_DOCTOR_MANAGE,
        component: userIsAuthenticated(userIsAdmin(DoctorManage)),
        layout: SystemLayout,
    },
    {
        path: path.SYSTEM_DOCTOR_SCHEDULE_MANAGE,
        component: userIsAuthenticated(userIsNotPatient(ManageSchedule)), // cho R1, R2
        layout: SystemLayout,
    },
    {
        path: path.SYSTEM_SPECIALTY_MANAGE,
        component: userIsAuthenticated(userIsAdmin(SpecialtyManage)),
        layout: SystemLayout,
    },
    { path: path.SYSTEM_ADD_CLINIC, component: userIsAuthenticated(userIsAdmin(AddClinic)), layout: SystemLayout },
    {
        path: path.SYSTEM_CLINIC_MANAGE,
        component: userIsAuthenticated(userIsAdmin(ClinicManage)),
        layout: SystemLayout,
    },
    {
        path: path.SYSTEM_DOCTOR_APPOINTMENT_MANAGE,
        component: userIsAuthenticated(userIsNotPatient(ManageAppointment)),
        layout: SystemLayout,
    },

    // home
    { path: path.DOCTOR_INFO, component: DoctorInfo },
    { path: path.SEARCH, component: SearchResultPage },
    { path: path.CLINIC_DETAIL, component: ClinicDetail },
    { path: path.BOOKING, component: userIsAuthenticated(Booking) },
    { path: path.BOOKING_VERIFY, component: userIsAuthenticated(BookingVerify), layout: HeaderOnlyLayout },
    { path: path.SPECIALTY_ALL, component: Specialty },
    { path: path.MY_PROFILE, component: userIsAuthenticated(MyFrofile) },
    { path: path.MY_APPOINTMENT, component: userIsAuthenticated(MyAppointment) },
    { path: path.CHATAI, component: ChatAI, layout: HeaderOnlyLayout },

    { path: path.Home, component: Home },

    
];
