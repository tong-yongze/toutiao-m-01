<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';

export default {
  name: 'UpdatePhoto',
  data() {
    return {
      cropper: null
    };
  },
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  created() {},
  mounted() {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1,   // 只能在画布内容当中
      dragMode: 'move',  // 拖动模式  可以拖动画布
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      // movable: true,  可以拖动图片  默认是true
    });
    // console.log(cropper)
  },
  methods: {
    onConfirm () {
      // 基于服务多裁切 可以得到裁切区域参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
          // console.log(blob)
      })
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
