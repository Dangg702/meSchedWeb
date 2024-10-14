import axios from '../axios';

const uploadImgService = {
    uploadImage(data) {
        return axios.post(`/api/create-clinic`, data);
    },
};

export default uploadImgService;
