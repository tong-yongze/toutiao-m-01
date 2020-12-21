<template>
  <div class="update-name">
     <!-- 导航栏 -->
    <van-nav-bar
  title="设置昵称"
  left-text="取消"
  right-text="完成"
  @click-left="$emit('close')"
  @click-right = "onConfirm"
/>
    <!-- /导航栏 -->

   <div class="field-wrap">
      <!-- 输入框 -->
      <van-field
    v-model.trim="localName"
    rows="2"
    autosize
    type="textarea"
    maxlength="7"
    placeholder="请输入昵称"
    show-word-limit
  />
    <!-- /输入框 -->
   </div>

  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  data () {
    return {
      localName: this.value
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  created () {

  },

  methods: {
  async onConfirm () {
    this.$toast.loading({
      message: '保存中...',
      forbidClick: true,   // 展示loading中 禁止背景点击
      duration: 0  // 持续展示  默认是2秒 当提示成功或失败 前面任何loading都会被关闭
    })
    try {
      const localName = this.localName
      if(!localName.length) {
        this.$toast('昵称不能为空')
        return
      }
      await updateUserProfile({
      name: localName
      })
      // console.log(data)
      // 更新视图 在父组件中有一个v-model 通过$emit发布一个input自定义事件 修改user.name  localName是更新后的数据
      this.$emit('input',localName)
      // 关闭弹层  自定义事件  父组件的close 关闭了弹层
      this.$emit('close')
      // 提示成功
      this.$toast.success('更新成功')
    } catch (err) {
      this.$toast.fail('更新失败')
    }
  }
  }
}
</script>

<style scoped lang='less'>
.field-wrap {
  padding: 20px;
}
</style>
