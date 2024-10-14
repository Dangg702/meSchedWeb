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
    getAllSchedule(date, page, perPage) {
        return axios.get(`/api/get-list-schedule?date=${date}&page=${page}&per_page=${perPage}`);
    },
    deleteSchedule(id) {
        return axios.delete(`/api/delete-schedule?id=${id}`);
    },
};

export default doctorService;
