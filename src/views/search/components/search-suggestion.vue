<template>
  <div class="search-suggestion">
   <van-cell
   :title="text"
   icon="search"
   v-for="(text,index) in suggestions"
   :key="index"
   ></van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'

// 按需加载有好处: 只会把使用到的成员打包到结果中
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
      searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions :[] // 联想建议数据列表
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生变化的时候就会调用 handler 函数
      // 注意： <ha></ha>ndler 函数名称是固定的
      // handler (value){
      //   // console.log(value);
      //   this.loadSearchSuggestions(value)
      // },
      // debounce 函数
      // 参数1：一个函数
      // 参数2：延时时间 单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function(value) {
        // console.log(value);
        this.loadSearchSuggestions(value)
      },1000),
      immediate: true  //该回调将会在侦听开始之后被立即调用
    }
  },
  created () {},
  mounted () {},
  methods: {
  async  loadSearchSuggestions (q){
    try {
      const { data } = await getSearchSuggestions(q)
      // console.log(data);
      this.suggestions = data.data.options
    } catch (err) {
      this.$toast('获取数据失败，请稍后重试')
    }
    }
  }
}
</script>

<style scoped lang="less"></style>
