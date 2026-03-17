import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/todos';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Clear local storage and redirect to login if unauthorized
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export const getTodos = () => api.get('/');
export const createTodo = (todo) => api.post('/', todo);
export const updateTodo = (id, todo) => api.put(`/${id}`, todo);
export const deleteTodo = (id) => api.delete(`/${id}`);

export default api;
