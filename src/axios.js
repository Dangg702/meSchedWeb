import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { userService } from './services';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true, //cho phép gửi cookie với yêu cầu
    crossDomain: true,
});

axios.defaults.withCredentials = true;
instance.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('accessToken');

instance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('persist:user')
            ? JSON.parse(localStorage.getItem('persist:user')).token.replace(/"/g, '')
            : null;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // return config;
        // const accessToken = Cookies.get('accessToken');
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
        console.log('instance err', error.response);
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // đăng xuất và điều hướng về trang login
                // await userService.logout();
                // window.location.href = '/login';
                // Gọi đến API /refresh-token để lấy token mới
                const { data } = await axios.post('/api/refresh-token', {}, { withCredentials: true });
                console.log('check ref', data);

                // Lưu access token mới vào cookie
                Cookies.set('accessToken', data.accessToken, { secure: true, sameSite: 'Strict' });

                // Thêm token mới vào header Authorization
                originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;

                // Thực hiện lại request ban đầu với token mới
                return instance(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
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
