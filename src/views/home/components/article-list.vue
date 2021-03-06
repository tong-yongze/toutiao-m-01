<template>
  <div class="article-list" ref="article-list">
    <!--
      List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
     -->
     <!--
       List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
      -->
    <van-pull-refresh
    v-model="isreFreshLoading"
    :success-text="refresgSuccessText"
    success-duration = "1500"
    @refresh="onRefresh"
    >
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
     :error.sync="error"
      error-text="请求失败，点击重新加载"
    @load="onLoad"
    >
    <article-item
    v-for="(article,index) in list"
      :key="index"
      :article= 'article'
    />
      <!-- <van-cell
      v-for="(article,index) in list"
      :key="index"
      :title="article.title" /> -->
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {getArticles} from '@/api/article'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [],  // 存储列表数据的数组
      loading: false, // 控制加载中 loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp : null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading :false,  // 控制下拉刷新的 loading 状态
      refresgSuccessText: '刷新成功', // 下拉刷新成功提示文本
      scrollT: 0
    };
  },
  methods: {
    async onLoad () {
      try {
          // 1.请求获取数据
          const {data} = await getArticles({
            channel_id: this.channel.id,   // 频道ID
            // 请求数据的页码
            // 请求第1页数据：当前最新时间戳
            // 用于请求之后数据的时间戳会在当前请求结果中返回给你
            timestamp: this.timestamp || Date.now(), // 时间戳 请求新的推荐数据传当前的时间戳
            // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
            with_top: 1
          })
          // 模拟随机失败的情况
          // if (Math.random() > 0.5) {
          //   JSON.parse('dsnajndjsa')
          // }
          // console.log(data);
           // 2.把请求结果数据放到 list 数组中
          const { results } = data.data
          // 数组的展开操作符 它会把数组元素一个一个拿出来
          this.list.push(...results)
          // 3.本次数据加载结束之后 要把加载状态设置为结束
            this.loading = false
          // 4.判断数据是否全部加载完成
        if(results.length) {
          // 更新获取下一页的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 木有数据了 将finished 设置为true  不再load 加载更多了
          this.finished = true
        }
      } catch (error) {
        // console.log('请求失败',err);
        // this.$toast('请求失败了')
        // 展示错误提示状态
        this.error = true
        // 请求失败了 loading 需要关闭
        this.loading = false
      }

    },

    // 当下拉刷新的时候会触发会调用该函数
  async  onRefresh (){
    try {
       // 1.请求获取数据
          const {data} = await getArticles({
            channel_id: this.channel.id,   // 频道ID
            timestamp: Date.now(), //  下拉刷新 每次请求获取最新数据 所以传递最新时间戳
            with_top: 1
          })

      // 2.将数据追加到列表的顶部
      const {results} = data.data
      this.list.unshift(...results)

      // 3.关闭下拉刷新的 loading 状态
      this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
          this.refresgSuccessText = `刷新成功,更新了${results.length}条数据`
    } catch (err) {
      // console.log('请求失败',err);
      this.isreFreshLoading = false
      this.refresgSuccessText = '刷新失败'

    }
    }
  },
  mounted() {
    // 1.滚动的时候 记录一下滚动的位置
    const articleList = this.$refs['article-list']  // 获取文章列表
    articleList.onscroll = debounce(()=> {
      // console.log(articleList.scrollTop)
      this.scrollT = articleList.scrollTop
    },100)
  },
  activated() {
    // 从缓存当中激活的时候触发
    // 2. 当组件从缓存列表当中激活的时候 把上次记录的位置给 article-list 的 scrollTop
     this.$refs['article-list'].scrollTop = this.scrollT
  },
  deactivated() {
    // 从缓存当中失活的时候触发
  },
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相当于父元素的
  // height: 100%;
  height: 79vh;
  overflow-y: auto;
}
</style>
