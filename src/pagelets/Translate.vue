<template>
  <div>
    <el-header>
      <trans-header></trans-header>
    </el-header>
    <el-main>
      <trans-list></trans-list>
    </el-main>
    <el-footer>
      <trans-footer></trans-footer>
    </el-footer>
  </div>
</template>

<script>
import TransHeader from '../components/TransHeader';
import TransFooter from '../components/TransFooter';
import TransList from '../components/TransList';

export default {
  components: {
    TransHeader,
    TransList,
    TransFooter,
  },
};
</script>

<style scoped>

</style>
