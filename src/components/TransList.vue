<template>
  <div>
    <trans-item v-for='path in pathList'
      :path="path"
      :key="path"
      ></trans-item>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import TransItem from './TransItem';

export default {
  name: 'trans-list',
  components: {
    TransItem,
  },
  computed: {
    ...mapState({
      fromLocale: 'fromLocale',
    }),
    ...mapGetters(['textPathList']),
    pathList() {
      return this.textPathList(this.fromLocale); // 以左侧的源文本为准
    },
  },
};
</script>

<style scoped>

</style>
