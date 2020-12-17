<template>
  <div class="search-history">
  <van-cell title="历史记录">
    <div v-if="isDeleteShow">
      <span>全部删除</span>
      &nbsp;&nbsp;
      <span @click="isDeleteShow = false">完成</span>
    </div>
    <van-icon v-else name="delete" @click="isDeleteShow = true"/>
  </van-cell>
  <van-cell
  :title="item"
  v-for="(item,index) in searchHistories"
  :key="index"
  >
    <van-icon v-if="isDeleteShow" name="close"/>
  </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>