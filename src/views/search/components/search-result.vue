<template>
  <div class="search-result">
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync ="error"
    error-text ="加载失败，请点击重试"
    @load="onLoad">
      <van-cell
      v-for="(article, index) in list"
      :key="index"
      :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perpage: 20,
      error: false
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
  async onLoad() {
      try {
        // 1.请求获取数据
       const { data } = await getSearchResult({
          page: this.page,   // 页码
          per_page: this.perpage,  // 每页数量
          q: this.searchText   // 查询关键词
        })
        // if(Math.random() > 0.5) {
        //   JSON.parse('DSDSDSD')
        // }

          // 2.将数据添加到数组列表中
          const { results } = dada.data
          this.list.push(...results)
           // 3.将本次加载中得 loading 关闭
           this.loading = false
           // 4. 判断你是否还有数据
           if(results.length) {
           //  如果有 则更新获取下一个数的页码
            this.page++
           } else {
              //  如果木有 则将加载状态 finished 设置为结束
              this.finished = true
           }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败  关闭loading
        this.loading = false
        // this.$toast('获取数据111，请稍后重试')
      }




    },
  },
};
</script>

<style scoped lang="less"></style>
