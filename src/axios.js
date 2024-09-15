import axios from 'axios';
import _ from 'lodash';
import config from './config';
import { toast } from 'react-toastify';
import { persistor } from './redux';
import reduxStore from './redux';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    crossDomain: true,
});

axios.defaults.withCredentials = true;

instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('persist:user')
            ? JSON.parse(localStorage.getItem('persist:user')).token.replace(/"/g, '')
            : null;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error.response || error.message);
    },
);

instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response.data ? response.data : { statusCode: response.status };
    },
    async function (error) {
        console.log(error.response);
        if (error.response && error.response.status === 401) {
            // Token hết hạn, cần làm mới token và thực hiện lại request
            // const newAccessToken = await refreshAccessToken();
            // Thử lại request với access token mới
            // if (newAccessToken) {
            //   error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            //   return axios.request(error.config);
            // }
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        const status = error.response?.status || 500;
        // we can handle global errors here
        switch (status) {
            // authentication (token related issues)
            case 401: {
                toast.error('Unauthorized');
                return Promise.reject(error);
            }

            // forbidden (permission related issues)
            case 403: {
                toast.error('Forbidden');
                return Promise.reject(error);
            }

            // bad request
            case 400: {
                toast.error(error.response.data.message);
                return Promise.reject(error);
            }

            // not found
            case 404: {
                toast.error('Not found');
                return Promise.reject(error);
            }

            // conflict
            case 409: {
                toast.error('Conflict');
                return Promise.reject(error);
            }

            // unprocessable
            case 422: {
                toast.error('Unprocessable');
                return Promise.reject(error);
            }

            // generic api error (server related) unexpected
            default: {
                return Promise.reject(error);
            }
        }
        // return Promise.reject(error);
    },
);

export default instance;
