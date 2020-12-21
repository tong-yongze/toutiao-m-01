<template>
  <div class="update-birthday">
    <!--
      currentDate 双向绑定了日期选择器
        设置日期选择器的默认值
        同步日期选择器选择的日期
     -->
      <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel = "$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs';

export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
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
      // 基于日期对象转成 dayjs  format()专门处理日期格式化
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      await updateUserProfile({
      birthday: currentDate
      })
      // 更新视图
      this.$emit('input', currentDate)
      // 关闭弹层  自定义事件  父组件的close 关闭了弹层
      this.$emit('close')
      // 提示成功
      this.$toast.success('更新成功')
    } catch (err) {
      this.$toast.fail('更新失败')
    }
  },

  }
}
</script>

<style scoped lang='less'>

</style>
