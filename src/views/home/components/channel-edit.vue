<template>
  <div class="channel-edit">
    <van-cell :border ="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
      class="edit-btn"
      type="danger"
      plain
      round
      size="mini"
      @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid
    class="my-grid"
    :gutter="10"
    >
    <van-grid-item
    class="grid-item"
    v-for="(channel,index) in myChannels"
    :key="index"
    @click="onMyChannelClick(channel,index)"
    >
    <!--
      v-bind：class 语法
      一个对象：对象中的 key 表示要作用的 CSS 类名
               对象中的 value 要计算出布尔值
               true 则作用该类名
               false 不作用类名
               第一个active 是class类名  第二个active 是父组件传下来的 props 数据   index 是点击的某某某
     -->
     <van-icon
     v-show="isEdit && !fiexChannels.includes(channel.id)"
     slot="icon"
     name="clear"
     ></van-icon>
    <span
    class="text"
    :class="{ active: index === active}"
    slot="text"
    >{{ channel.name }}</span>
    </van-grid-item>
  </van-grid>

  <!-- 频道推荐 -->
   <van-cell :border ="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
    <van-grid-item
     class="grid-item"
    v-for="(channel,index) in recommendChannels"
    :key="index"
    icon="plus"
    :text="channel.name"
    @click="onAddChannel(channel)"
    />
  </van-grid>
  <!-- /频道推荐 -->
  </div>
</template>

<script>
import {getAllChannels} from '@/api/channel'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active:{
      type: Number,
      required:  true
    }
  },
  data () {
    return {
      allChannels: [] ,// 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0,11] // 固定频道，不允许删除
    }
  },
  computed: {
    // 最简单的 lodash  用法 ：
    /* let r = _.difference([2, 1, 3, 5], [2, 8]);
        console.log(r); */
    //  _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
    // => [{ 'x': 2 }]
    recommendChannels () {
    const _ = require('lodash')
    return _.differenceBy(this.allChannels, this.myChannels, 'id');
    }
    // 第三种方法 通过返回值 return
    //  recommendChannels () {
    //  return  this.allChannels.filter(item => {
    //  // 如果说 item 在 myChannels 里面找不到，就保留
    //  // 返回值是 undefined 的时候就是找不到
    //  let res = this.myChannels.find(channel => item.id === channel.id);
    //  return !res
    // });
    //     }

    // 第二种方法  简化第一种
    // recommendChannels(){
    //   // 数组的filter 方法： 遍历数组 ，把符合条件的元素存储到新数组
    //   return this.allChannels.filter(channel => {
    //     // const channels = []  这是是filter 内部创建了一个空数组

    //     // 数组的find 方法：遍历数组，把符合条件的第 1 个元素返回
    //     // 如果 channel 不属于 myChannels 才把它return 收集到上面的数组
    //     // 代码运算结果如果是true channel 放到 数组里面 如果是false 就不收集
    //     return !this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //   })
    // }
    // 第一种方法 2次遍历 复杂
    // recommendChannels (){
    //   const channels = [] // 存储频道推荐的数组
    //   // 核心思路:所有频道-用户频道 = 推荐频道
    //   // 每遍历一次 就问我的频道中包含 这个channel 频道嘛 不包含我就要 包含就不要了
    //   this.allChannels.forEach(channel =>{
    //     // find 遍历数组 找到满足条件的元素
    //     // 遍历myChannels 数组 每遍历一次就问当前我的频道 等于你这个channel id吗 如果是 返回满足该条件的元素(就返回给我的myChannels 频道) 遍历就停止了
    //     const ret = this.myChannels.find(myChannel => {
    //         return myChannel.id === channel.id
    //       })
    //       // 如果我的频道中不包含该频道项 channel 则收集到推荐频道中 把满足条件的push到 channels中
    //       if(!ret) {
    //         channels.push(channel)
    //       }
    //   })
    //   // 把计算结果返回给存储的数组
    //   return channels
    // }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
  async  loadAllChannels(){
    try {
      const {data} = await getAllChannels()
      // console.log(data);
      this.allChannels = data.data.channels
    } catch (err) {
      this.$toast('数据获取失败')
    }
  },
  onAddChannel (channel) {
    // console.log(channel); 点击可以拿到推荐频道的数据
    this.myChannels.push(channel)
  },
  onMyChannelClick (channel,index) {
    if(this.isEdit) {
      // 编辑状态 执行删除频道
    } else {
      // 非编辑状态，执行切换频道
      this.$emit('update-active',index)
    }
  }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
    white-space: nowrap;
    background-color: #f4f5f6;
    .van-grid-item__text , .text{
      font-size: 28px;
      color: #222;
      margin-top: 0;
    }
    .active {
      color: red;
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        color: #cacaca;
        font-size: 30px;
        z-index: 2;
      }
    }
  }

 /deep/ .recommend-grid {
   .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
       }
   }
 }
}
</style>