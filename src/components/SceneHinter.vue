<template>
<div>
  <el-carousel
  indicator-position="outside"
  :autoplay="false"
  >
    <el-carousel-item v-for="imageUrl in sceneImages" :key="imageUrl">
      <div v-viewer>
        <img :src="imageUrl" class="img" :width="imgWidth" :height="imgHeight">
      </div>
    </el-carousel-item>
  </el-carousel>
</div>
</template>

<script>
/**
 * 词条场景提示器
 */
export default {
  name: 'scene-hinter',
  props: {
    sceneImages: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      imgWidth: '100%',
      imgHeight: '100%',
      isEnlarged: false,
    };
  },
  computed: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.img {
  cursor: pointer;
}
</style>
