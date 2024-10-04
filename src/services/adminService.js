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
};

export default adminService;
