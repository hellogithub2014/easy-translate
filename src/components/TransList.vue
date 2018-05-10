<template>
  <div>
    <trans-item v-for='path in textPathList'
      :path="path"
      :key="path"
      ></trans-item>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TransItem from './TransItem';

export default {
  name: 'trans-list',
  components: {
    TransItem,
  },
  computed: {
    ...mapState({
      messages: 'messages',
      fromLocale: 'fromLocale',
      toLocale: 'toLocale',
    }),
    // other computed ...
    /** 翻译列表中的每一条key. TODO: 暂时不考虑多层级的path，届时会返回类似 'a.b.c' 的数组  */
    textPathList() {
      return Object.keys(this.messages[this.fromLocale]); // 以左侧的源文本为准
    },
  },
};
</script>

<style scoped>

</style>
