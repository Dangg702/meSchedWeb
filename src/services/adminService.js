import axios from '../axios';

const adminService = {
    /**
     * Đăng nhập hệ thống
     * {
     *  "username": "string",
     *  "password": "string"
     * }
     */
    login(loginBody) {
        return axios.post(`/admin/login`, loginBody);
    },
    createClinic(data) {
        return axios.post(`/api/create-clinic`, data);
    },
    getAllClinic(name, page, perPage) {
        return axios.get(`/api/get-clinics?name=${name}&page=${page}&per_page=${perPage}`);
    },
};

export default adminService;
