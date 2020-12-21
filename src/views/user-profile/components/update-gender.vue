<template>
  <div class="update-gender">
        <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      :default-index = "value"
      @cancel = "$emit('close')"
      @confirm = "onConfirm"
      @change = "onPickerChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男','女'],
      localGender: this.value
    }
  },
  props: {
    value: {
      type: Number,
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
      const localGender = this.localGender
      await updateUserProfile({
      gender: localGender
      })
      // 更新视图
      this.$emit('input', localGender)
      // 关闭弹层  自定义事件  父组件的close 关闭了弹层
      this.$emit('close')
      // 提示成功
      this.$toast.success('更新成功')
    } catch (err) {
      this.$toast.fail('更新失败')
    }
  },
    onPickerChange (picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style scoped lang='less'>

</style>
