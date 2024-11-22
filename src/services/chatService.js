import axios from '../axios';

const chataitService = {
    getConfig() {
        return axios.post(`/api/chatai/message`);
    },
};

export default chataiService;
