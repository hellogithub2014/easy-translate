<template>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-submenu index="1">
      <template slot="title">切换模式</template>
      <el-menu-item @click="updateMode(MODE.NORMAL)" index="1-1">普通模式</el-menu-item>
      <el-menu-item @click="updateMode(MODE.EXPERT)" index="1-2">专家模式</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapMutations } from 'vuex';
import { MODE } from '../const/store';
import TYPES from '../store/mutation-types';

export default {
  name: 'nav-menu',
  data() {
    return {
      MODE,
    };
  },
  methods: {
    ...mapMutations({
      updateMode: TYPES.UPDATE_MODE,
    }),
  },
};
</script>

<style scoped>
</style>
