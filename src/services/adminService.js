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
        return axios.post(`/api/create-clinic`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    updateClinic(id, newData) {
        return axios.patch(`/api/update-clinic?id=${id}`, newData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteClinic(id) {
        return axios.delete(`/api/delete-clinic?id=${id}`);
    },
    getAllClinic(name, page, perPage) {
        return axios.get(`/api/get-clinics?name=${name}&page=${page}&per_page=${perPage}`);
    },
};

export default adminService;
