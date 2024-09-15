import axios from '../axios';

const doctorService = {
    getDoctors() {
        return axios.get(`/api/get-all-doctors`);
    },
    postInfoDoctor(data) {
        return axios.post(`/api/post-info-doctor`, data);
    },
    getDoctorInfoById(id) {
        return axios.get(`/api/get-doctor?id=${id}`, {
            headers: {
                authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
            },
        });
    },
    createDoctorSchedule(data) {
        return axios.post(`/api/create-schedule-time`, data);
    },
};

export default doctorService;
