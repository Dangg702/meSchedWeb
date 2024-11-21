import axios from '../axios';

const paymentService = {
    getConfig() {
        return axios.get(`/api/payment/config`);
    },
};

export default paymentService;
