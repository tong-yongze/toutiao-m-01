import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用 relativeTime 处理相对时间的 插件
dayjs.extend(relativeTime)

// dayjs 默认语言是英文  我们配置为中文
dayjs.locale('zh-cn') // 全局使用

// 定义要给全局过滤器 就可以任何组件模板使用
// 参数1 过滤器名字  参数2 过滤器函数
// 使用方式： {{表达式 | 过滤器名称}}
// 管道符前面的表达式的结果会作为参数传递到过滤器函数中 过滤器返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime',value=>{
  // console.log(value); // 文章的原始发布时间
  return dayjs().to(dayjs('2020'))
})

// dayjs() 获取当前最新时间
// console.log(dayjs().format('YYYY-MM-DD'));

// console.log(dayjs().to(dayjs('2019')));  // 2 年前


