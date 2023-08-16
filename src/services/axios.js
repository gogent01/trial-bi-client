import axios from 'axios';
const axiosInstance = axios.create({ timeout: 10 * 1000 });
export { axiosInstance };
