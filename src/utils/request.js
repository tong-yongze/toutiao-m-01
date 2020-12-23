/**
 * 封装 axios 请求模块
 */
import axios from 'axios';
import store from '@/store/index';
import JSONbig  from 'json-bigint';
import {Toast} from 'vant'
import router from '@/router';

// JSONbig 可以处理数据中的大数字问题
// JSONbig.parse()  // 把 JSON 格式的字符串转为 js 对象
// JSONbig.stringify()  // 把 js 对象 转为 JSON 格式的字符串

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径

  // 自定义后端返回的原始数据
  // data： 后端返回的原始数据 就是 JSON 格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
    // axios 默认会在内部这样来处理后端返回的数据
    // return JSON.parse(data)
  }]
})

const  requestToken = axios.create()

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // 请求发起会经过这里
    // config ：本次请求的请求配置对象
    // console.log(config)
    const { user } = store.state;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    // 注意： 这里是要返回config 配置对象 否则请求就停在这里出不去了
    return config;
  },
  function(error) {
    // 如果请求出错了 （还木有发出去） 会进入这里
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status
  if (status === 400) {
    Toast.fail('客户端请求参数错误')
  } else if (status === 401) {
    const { user } = store.state
    if(!user || !user.refresh_token) {
      // 没有 不存在的 直接去登录吧  没办法了 跳转到登录页面
      // this.$router.push => 组件里面可以这样跳  js文件不能
      // router.push('/login')
      // 登录路由其实没有必要 不期望保留历史记录
      // replace 不会保留登录的历史记录  点后退不会跳转到登录页
      //  return router.replace('/login')
      return redirectLogin()
    }
    // 无效的 Token
    // 用 refresh_token 获取新的 token
    // 直接用现有的 request 去请求  假如请求的结果还是401  会形成死循环
    try {
     const {data } = await requestToken({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 把data 里面新的token 更新给user里面过期的
      user.token = data.data.token
      // 用新的 token 更新 store 里面的无效的 token
      store.commit('setUser', user )
      // 把之前的错误请求 重新完整的再发一次
      // 这里发送请求 带过去的 token 确实是无效的 token 但是没关系 因为这个请求会经过自己的请求拦截器
      // 自己的请求拦截器 会有重新获取 token 的操作
      return request(error.config)
      console.log(data,111)
    } catch (error) {
      // 用 refresh_token 换器 token 也出错了
      return redirectLogin()
    }

    // 用新的 token 重新请求数据
    // Toast.fail('无效的TOKEN')
  } else if (status === 403) {
    Toast.fail('客户端没有权限')
  } else if (status === 404) {
    Toast.fail('请求资源不存在')
  } else if (status === 405) {
    Toast.fail('请求方法不支持')
  } else if (status >= 500) {
    Toast.fail('服务器抽风了')
  }
  // 错误处理
  return Promise.reject(error)
})

function redirectLogin() {
  router.replace({
    name: 'login',
    query: {
      // router.currentRoute => this.$.router
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request;
