<template>
  <div class="article-list">
    <!--
      List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
     -->
     <!--
       List 组件通过 loading 和 finished 两个变量控制加载状态，当组件滚动到底部时，会触发 load 事件并将 loading 设置成 true。此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
      -->
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad">
      <van-cell
      v-for="(article,index) in list"
      :key="index"
      :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import {getArticles} from '@/api/article'

export default {
  name: 'ArticleList',
  components: {},
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
      timestamp : null // 请求获取下一页数据的时间戳
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
          console.log(data);
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
      } catch (err) {
        console.log('请求失败',err);
      }

    }
  }
}
</script>

<style lang="less"></style>
