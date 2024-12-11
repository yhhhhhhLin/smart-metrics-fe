import axios from "axios";
import router from "../router";
import {Notification} from "@arco-design/web-vue";

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:9527',
    timeout: 5000,
});

// 请求拦截器
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    // 如果有 token，添加到请求头
    if (token != null) {
        config.headers.token = token;
    }
    return config;
}, function (error) {
    // 请求错误时提示错误信息
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(function (response) {
    const responseCode = response.data.code;

    // 如果返回的 code 是 0，则认为请求成功
    if (responseCode === 0) {
        return response
    } else {
        // 如果 code 不是 0，提示错误信息
        Notification.warning({
            title: '系统提示',
            content: '出现错误:' + response.data.message
        })
        console.log(response)
        // 可以根据错误code统一处理
    }

    return response // 返回数据
}, function (error) {
    // 处理响应错误
    if (error.response) {
        // 错误码处理
        const status = error.response.status;
        if (status === 401) {
            Notification.warning({
                title: '系统提示',
                content: '请先登录'
            })
            router.push('/user/login');
        } else if (status === 403) {
            Notification.warning({
                title: '系统提示',
                content: '没有权限'
            })
        } else {
            // 显示其他类型的错误信息
            Notification.warning({
                title: '系统提示',
                content: error
            })

        }
    } else if (error.request) {
        // 请求已发送但没有响应
    } else {
        // 其他错误
    }

    return Promise.reject(error);
});

export default instance;
