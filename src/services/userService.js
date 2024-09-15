import axios from '../axios';

const userService = {
    login(email, password) {
        return axios.post(`/api/login`, { email, password });
    },
    logout() {
        return axios.post(`/api/logout`);
    },
    getOpt(email) {
        return axios.post(`/api/generate-otp`, { email });
    },
    verifyOtpCode(otp) {
        return axios.post(`/api/verify-otp`, { otp });
    },
    getUsers(id, page, perPage) {
        return axios.get(`/api/get-users?id=${id}&page=${page}&per_page=${perPage}`);
    },
    createUser(data) {
        return axios.post(`/api/create-user`, data);
    },
    editUser(id, newData) {
        return axios.patch(`/api/update-user?id=${id}`, newData);
    },
    deleteUser(id) {
        return axios.delete(`/api/delete-user?id=${id}`);
    },
    getAllCodeService(type) {
        return axios.get(`/api/get-all-code?type=${type}`);
    },
    getTopDoctors(limit) {
        return axios.get(`/api/get-top-doctor?limit=${limit}`);
    },
    getDoctorSchedule(doctorId, date) {
        return axios.get(`/api/get-schedule-time?doctorId=${doctorId}&date=${date}`);
    },
    getExtraInfoDoctor(doctorId) {
        return axios.get(`/api/get-extra-info-doctor?id=${doctorId}`);
    },
    getProfileDoctor(doctorId) {
        return axios.get(`/api/get-profile-doctor?id=${doctorId}`);
    },

    bookingAppointment(data) {
        return axios.post(`/api/booking-appointment`, data);
    },
};

export default userService;
