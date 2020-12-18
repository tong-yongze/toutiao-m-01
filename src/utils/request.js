/**
 * 封装 axios 请求模块
 */
import axios from 'axios';
import store from '@/store/index';
import JSONBig from 'json-bigint';


// JSONBig 可以处理数据中的大数字问题
// JSONBig.parse()  // 把 JSON 格式的字符串转为 js 对象
// JSONBig.stringify()  // 把 js 对象 转为 JSON 格式的字符串

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径

  // 自定义后端返回的原始数据
  // data： 后端返回的原始数据 就是 JSON 格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
    // axios 默认会在内部这样来处理后端返回的数据
    // return JSON.parse(data)
  }]
})



// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // 请求发起会经过这里
    // config ：本次请求的请求配置对象
    // console.log(config);
    const { user } = store.state;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    // 注意： 这里无比要返回config 配置对象 否则请求就停在这里出不去了
    return config;
  },
  function(error) {
    // 如果请求出错了 （还木有发出去） 会进入这里
    return Promise.reject(error);
  }
);

// 响应拦截器

export default request;
