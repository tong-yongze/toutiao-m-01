<template>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  :error= "error"
  error-text="加载失败，请点击重试！"
  >
    <comment-item
    v-for="(item,index) in list"
    :key="index"
    :comment = "item"
   @reply-click = "$emit('reply-click', $event)"
    />
  </van-list>
</template>
<script>
import { getComments } from '@/api/comment';
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [] // 给它一个默认值 如果父组件需要 就绑list 如果不需要还是一个数组
    }
  },
  components: {
    CommentItem
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  created() {
    this.onLoad()
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data } = await getComments({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 	获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data);
        // 2.将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)

        // 把文章评论的总数量传递给外部
        this.$emit('onload-success', data.data)

        // 3.将loading 设置为 false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          //  没有就将 finished 设置结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>
<style lang=""></style>
