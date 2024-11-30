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

    register(data) {
        return axios.post(`/api/register`, data);
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
        return axios.get(`/api/get-doctor?id=${doctorId}`);
    },
    checkAppointment(data) {
        return axios.post(`/api/check-appointment`, data);
    },
    bookingAppointment(data) {
        return axios.post(`/api/booking-appointment`, data);
    },
    verifyBooking(data) {
        return axios.post(`/api/verify-booking-appointment`, data);
    },
    createSpecialty(data) {
        return axios.post(`/api/create-specialty`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    editSpecialty(id, newData) {
        return axios.patch(`/api/update-specialty?id=${id}`, newData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteSpecialty(id) {
        return axios.delete(`/api/delete-specialty?id=${id}`);
    },
    getSpecialty(name, page, perPage) {
        return axios.get(`/api/get-all-specialty?name=${name}&page=${page}&per_page=${perPage}`);
    },
    getDoctorBySpecialtyId(id) {
        return axios.get(`/api/get-doctor-by-specialty?id=${id}`);
    },
    getClinics() {
        return axios.get(`/api/get-all-clinic`);
    },
    getAllClinic(name, page, perPage) {
        return axios.get(`/api/get-clinics?name=${name}&page=${page}&per_page=${perPage}`);
    },
    getClinicById(id) {
        return axios.get(`/api/get-clinic-detail-by-id?id=${id}`);
    },
    getListAppointmentPatient(doctorId, date) {
        return axios.get(`/api/lists-appointment-patient?doctorId=${doctorId}&date=${date}`);
    },
    confirmAppointment(data) {
        return axios.post(`/api/confirm-appointment`, data);
    },
    cancelAppointment(data) {
        return axios.post(`/api/cancel-appointment`, data);
    },
    getListAppointmentOfPatientById(patientId) {
        return axios.get(`/api/list-my-appointment?id=${patientId}`);
    },
    searchDoctorBySpecialty(specialty) {
        return axios.get(`/api/book-exam/search?type=specialty&q=${specialty}`);
    },
    searchDoctorByName(doctorName) {
        return axios.get(`/api/book-exam/search?type=doctor&q=${doctorName}`);
    },
    searchClinic(clinicName) {
        return axios.get(`/api/book-exam/search?type=clinic&q=${clinicName}`);
    },
    searchAll(q) {
        return axios.get(`/api/book-exam/search?type=all&q=${q}`);
    },
    getDoctors(name, page, perPage) {
        return axios.get(`/api/get-doctors?name=${name}&page=${page}&per_page=${perPage}`);
    },
    forgotPasswordSendOtp(email) {
        return axios.post(`/check-email`, { emailUser:email });
    },
    forgotPasswordVerifyOtp(otp, email) {
        return axios.post(`/check-otp`, { otp, email });
    },
    forgotPasswordResetPassword(otp, email, anewpassword, passwordRetrieval) {
        return axios.put(`/change-password`, { otp, email, anewpassword, passwordRetrieval });
    },
};

export default userService;
