<template>
 <!--注意：模板只能有一个根节点 因为有个v-if 和else 只会有一个节点被渲染出来 -->
      <van-button
            v-if="isFollowed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading = "loading"
          >已关注</van-button>

          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            :loading = "loading"
          >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
    name:'FollowUser',
    data(){
      return {
        loading: false
      }
    },
    props:{
      isFollowed:{
        type: Boolean,
        required: true
      },
      userId: {
        type: [Number, String, Object], // 因为有可能是大数字数据 会被转换为对象格式
        required: true
      }
    },
    methods: {
       async onFollow () {
          this.loading = true  //  一上来点击了就展示关注按钮的 loading
      try {
        if(this.isFollowed) {
            // 已关注 取消关注
          deleteFollow(this.userId)  // 因接口问题 取消了 await
          //  await deleteFollow(this.article.aut_id)
            // this.article.is_followed = false
        } else {
           // 没有关注 添加关注
        await addFollow(this.userId)
        // console.log(data)
        // this.article.is_followed = true
        }

        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请重试！'
        if(err.response && err.response.status === 400) {
          message = '你不能关注你自己！'
        }
        this.$toast(message)
      }
     this.loading =  false  // 关闭关注按钮的 loading
    }
    },
}
</script>

<style>

</style>