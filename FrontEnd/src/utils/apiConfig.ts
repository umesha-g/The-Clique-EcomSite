import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.1.100:8080/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const prefix = 'http://192.168.1.100:8080'