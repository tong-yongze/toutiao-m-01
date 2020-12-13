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
      v-for="item in list"
      :key="item"
      :title="item" />
    </van-list>
  </div>
</template>

<script>
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
    };
  },
  methods: {
     onLoad () {
       // 初始话或到滚动到 底部的时候会触发调用 onload
       console.log('onLoad');
      // 异步更新数据
      // 1.请求获取数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        // 2. 把请求结果数据放到list 数组中
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 3.本次数据加载结束之后 要把加载状态设置为结束
        // loading 关闭以后才能触发下一个加载
        this.loading = false

        // 4.判断数据是否全部加载完成
        if (this.list.length >= 40) {
          // 如果木有数据了 把finished 设置为 true   之后就不会触发 加载更多
          this.finished  = true
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less"></style>
